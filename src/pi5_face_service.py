"""
pi5_face_service.py — FastAPI service: /face_emotion endpoint only
Runs on the Raspberry Pi 5 alongside the BayMax Electron face app.

Run with:
    uvicorn src.pi5_face_service:app --host 0.0.0.0 --port 7000

The Electron face window exposes:
    window.setExpression(expr)   (via executeJavaScript IPC in main.js)

This service bridges incoming HTTP POST /face_emotion { "emotion": <int> }
to the Electron renderer by calling setExpression() through a subprocess
that sends an IPC message, or – if running in the same process context –
by directly invoking the JS bridge helper below.

Emotion Code → Frontend Expression Mapping (from Design.md §2.2):
    0  Normal    → 'idle'
    1  Searching → 'scanning'
    2  Happy     → 'happy'
    3  Talking   → 'talking'
    4  Thinking  → 'thinking'

The Electron main process (main.js) already handles 'set-expression' IPC events:
    ipcMain.on('set-expression', (event, expression) => {
        faceWindow.webContents.executeJavaScript(`setExpression('${expression}')`);
    });

To bridge FastAPI → Electron renderer we use a lightweight WebSocket push
that the Electron renderer listens on, OR you can replace _apply_expression()
with any suitable IPC mechanism (e.g. stdin pipe, unix socket, etc.).
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import logging
import urllib.request
import uvicorn

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("pi5_face_service")

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="BayMax π5 Face Emotion Service",
    description="Receives emotion codes from the GPU server and drives the BayMax face UI.",
    version="1.0.0",
)

# Allow local Electron renderer (file://) and the GPU server to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Emotion → Electron expression mapping ─────────────────────────────────────
# Corresponds to Design.md §2.2 Emotion Codes and the frontend setExpression() API
EMOTION_MAP: dict[int, str] = {
    0: "idle",       # Normal     — neutral resting face
    1: "scanning",   # Searching  — eyes scanning left/right
    2: "happy",      # Happy      — smile; greeting / farewell
    3: "talking",    # Talking    — animated mouth
    4: "thinking",   # Thinking   — furrowed / loading indicator
}

# ── In-memory state ───────────────────────────────────────────────────────────
_current_emotion: int = 1  # start as Searching (matches Design.md startup)

# ── Request schema ────────────────────────────────────────────────────────────
class FaceEmotionRequest(BaseModel):
    emotion: int  # 0=Normal, 1=Searching, 2=Happy, 3=Talking, 4=Thinking


# ── Frontend bridge ───────────────────────────────────────────────────────────
_IPC_BRIDGE_URL = "http://127.0.0.1:8768/set-expression"


def _apply_expression(expression: str) -> None:
    """Drive the Electron renderer via its internal HTTP IPC bridge (port 8768)."""
    logger.info("[face] Setting expression → %s", expression)
    payload = json.dumps({"expression": expression}).encode()
    req = urllib.request.Request(
        _IPC_BRIDGE_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=2) as resp:
            logger.debug("[face] IPC bridge OK: %s", resp.read().decode())
    except Exception as exc:
        logger.warning("[face] IPC bridge error for '%s': %s", expression, exc)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/face_emotion")
async def face_emotion(req: FaceEmotionRequest):
    """
    POST /face_emotion
    Body: { "emotion": <int 0-4> }

    Maps the emotion code to a frontend expression string and applies it
    to the BayMax Electron face UI.

    Emotion codes (Design.md §2.2):
        0 = Normal    → idle
        1 = Searching → scanning
        2 = Happy     → happy
        3 = Talking   → talking
        4 = Thinking  → thinking
    """
    global _current_emotion

    # Validate
    if req.emotion not in EMOTION_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"emotion must be 0–4, got {req.emotion}",
        )

    expression = EMOTION_MAP[req.emotion]

    # Apply to face (non-blocking — run in thread pool so we don't hold the event loop)
    await asyncio.get_event_loop().run_in_executor(
        None, _apply_expression, expression
    )

    _current_emotion = req.emotion
    logger.info("[face_emotion] emotion=%d → expression=%s", req.emotion, expression)

    return {"status": "ok", "emotion": req.emotion, "expression": expression}


@app.get("/health")
def health():
    """Health check — returns current emotion state."""
    return {
        "status": "ok",
        "face_emotion": _current_emotion,
        "expression": EMOTION_MAP.get(_current_emotion, "unknown"),
    }


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7000)
