// llm-integration.js - Example LLM Integration
// This file shows how to integrate an LLM with the BayMax face UI
// Uncomment and modify when ready to integrate with your LLM

/*
const { ipcMain } = require('electron');

class LLMFaceIntegration {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.isProcessing = false;
    this.isSpeaking = false;
  }

  setupListeners() {
    // Listen for LLM events from your LLM service
    ipcMain.on('llm-listening', () => {
      this.onListening();
    });

    ipcMain.on('llm-processing', () => {
      this.onProcessing();
    });

    ipcMain.on('llm-speaking-start', () => {
      this.onSpeakingStart();
    });

    ipcMain.on('llm-speaking-end', () => {
      this.onSpeakingEnd();
    });

    ipcMain.on('llm-error', (event, error) => {
      this.onError(error);
    });

    ipcMain.on('llm-idle', () => {
      this.onIdle();
    });
  }

  onListening() {
    console.log('LLM: Listening...');
    this.mainWindow.webContents.send('change-expression', 'idle');
    this.mainWindow.webContents.send('update-status', 'Listening...');
  }

  onProcessing() {
    console.log('LLM: Processing...');
    this.isProcessing = true;
    this.mainWindow.webContents.send('change-expression', 'thinking');
    this.mainWindow.webContents.send('update-status', 'Thinking...');
  }

  onSpeakingStart() {
    console.log('LLM: Speaking...');
    this.isSpeaking = true;
    this.isProcessing = false;
    this.mainWindow.webContents.send('change-expression', 'talking');
    this.mainWindow.webContents.send('update-status', 'Speaking...');
  }

  onSpeakingEnd() {
    console.log('LLM: Finished speaking');
    this.isSpeaking = false;
    
    // Brief happy expression after speaking
    this.mainWindow.webContents.send('change-expression', 'happy');
    
    // Return to idle after 1 second
    setTimeout(() => {
      if (!this.isProcessing && !this.isSpeaking) {
        this.onIdle();
      }
    }, 1000);
  }

  onError(error) {
    console.error('LLM Error:', error);
    this.isProcessing = false;
    this.isSpeaking = false;
    this.mainWindow.webContents.send('change-expression', 'surprised');
    this.mainWindow.webContents.send('update-status', 'Error occurred');
    
    // Return to idle after 2 seconds
    setTimeout(() => this.onIdle(), 2000);
  }

  onIdle() {
    console.log('LLM: Idle');
    this.isProcessing = false;
    this.isSpeaking = false;
    this.mainWindow.webContents.send('change-expression', 'idle');
    this.mainWindow.webContents.send('update-status', 'Ready');
  }

  // Helper method to trigger blink during idle times
  periodicBlink() {
    if (!this.isProcessing && !this.isSpeaking) {
      this.mainWindow.webContents.send('trigger-blink');
    }
  }
}

module.exports = LLMFaceIntegration;
*/

// TO USE THIS INTEGRATION:
//
// 1. In main.js, uncomment and add:
//    const LLMFaceIntegration = require('./llm-integration.js');
//    let llmIntegration;
//
//    After creating the window:
//    llmIntegration = new LLMFaceIntegration(mainWindow);
//    llmIntegration.setupListeners();
//
// 2. In your LLM service/code, send IPC events:
//
//    When user starts speaking:
//    ipcRenderer.send('llm-listening');
//
//    When LLM starts processing:
//    ipcRenderer.send('llm-processing');
//
//    When LLM starts speaking response:
//    ipcRenderer.send('llm-speaking-start');
//
//    When LLM finishes speaking:
//    ipcRenderer.send('llm-speaking-end');
//
//    On error:
//    ipcRenderer.send('llm-error', { message: 'Error description' });
//
//    Return to idle:
//    ipcRenderer.send('llm-idle');
//
// 3. EXAMPLE WORKFLOW:
//
//    User: "Hello BayMax"
//      → Face: 'idle' with 'Listening...'
//
//    LLM: Processing speech...
//      → Face: 'thinking' with 'Thinking...'
//
//    LLM: Generating response...
//      → Face: 'thinking' with 'Thinking...'
//
//    LLM: Speaking "Hello! How can I help you?"
//      → Face: 'talking' with 'Speaking...'
//
//    LLM: Finished speaking
//      → Face: 'happy' (1 second) → 'idle' with 'Ready'
//
// 4. INTEGRATION WITH POPULAR LLM FRAMEWORKS:
//
//    For OpenAI Whisper + GPT:
//    - Set 'listening' when starting Whisper transcription
//    - Set 'processing' when sending to GPT
//    - Set 'talking' when playing TTS response
//
//    For local LLMs (Ollama, LLaMA):
//    - Set 'listening' during audio capture
//    - Set 'processing' during inference
//    - Set 'talking' during TTS playback
//
// 5. COMBINED WITH ROS2:
//    You can also publish LLM states to ROS2 topics:
//    - /robot/llm/state (String): current LLM state
//    - /robot/llm/transcript (String): user speech transcript
//    - /robot/llm/response (String): LLM response text
//
// 6. EXAMPLE: Voice Assistant Integration
/*
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');

async function handleVoiceInteraction() {
  // Start listening
  ipcRenderer.send('llm-listening');
  const transcript = await captureAudio();
  
  // Processing
  ipcRenderer.send('llm-processing');
  const response = await getLLMResponse(transcript);
  
  // Speaking
  ipcRenderer.send('llm-speaking-start');
  await speakResponse(response);
  ipcRenderer.send('llm-speaking-end');
}
*/
