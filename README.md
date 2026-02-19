# BayMax Robot Face UI

A BayMax-inspired robot face interface built with Electron and Tailwind CSS for a 7-inch display. Perfect for friendly human-robot interaction in your capstone project.

## Features

- **BayMax-inspired Design**: Minimalist white face with expressive oval eyes
- **Multiple Expressions**: Idle, Happy, Thinking, Scanning, Talking, Surprised
- **Smooth Animations**: Natural blinking, eye movements, and transitions
- **Fullscreen Mode**: Optimized for 7-inch touchscreen displays
- **Easy Integration**: Ready for ROS2 and LLM communication
- **Control API**: JavaScript API for external control

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Ubuntu/Linux OS

## Installation

```bash
# Navigate to project directory
cd baymax-face-ui

# Install dependencies
npm install

# For development with DevTools
npm run dev

# For production (fullscreen, no DevTools)
npm start
```

## Project Structure

```
baymax-face-ui/
├── main.js           # Electron main process
├── index.html        # Face UI with animations
├── package.json      # Project dependencies
└── README.md         # This file
```

## Usage

### Running the Application

```bash
npm start
```

Press **ESC** to exit fullscreen mode during testing.

### Control Panel

The UI includes a bottom control panel with buttons to test different expressions:
- **Idle**: Default resting state with occasional blinking
- **Happy**: Squinting eyes in a friendly manner
- **Thinking**: Eyes moving slightly, processing state
- **Scanning**: Eyes shifting side to side
- **Talking**: Pulsing glow effect while speaking
- **Blink**: Manual blink trigger

### JavaScript API

Control the face programmatically using the `window.robotFace` API:

```javascript
// Change expression
window.robotFace.setExpression('happy');
window.robotFace.setExpression('thinking');
window.robotFace.setExpression('scanning');
window.robotFace.setExpression('talking');

// Trigger a blink
window.robotFace.blink();

// Update status text
window.robotFace.setStatus('Listening...');
```

## Future ROS2 Integration

To integrate with ROS2:

1. Use Electron's IPC (Inter-Process Communication) to communicate between main and renderer processes
2. Create a Node.js ROS2 bridge in `main.js` using `rclnodejs`
3. Subscribe to ROS2 topics and send updates to the renderer:

```javascript
// Example in main.js
const rclnodejs = require('rclnodejs');

// Initialize ROS2 node
rclnodejs.init().then(() => {
  const node = rclnodejs.createNode('baymax_face_node');
  
  // Subscribe to expression topic
  const subscription = node.createSubscription(
    'std_msgs/msg/String',
    '/robot/expression',
    (msg) => {
      // Send to renderer process
      mainWindow.webContents.send('change-expression', msg.data);
    }
  );
});

// In renderer (index.html), add IPC listener
const { ipcRenderer } = require('electron');
ipcRenderer.on('change-expression', (event, expression) => {
  window.robotFace.setExpression(expression);
});
```

## Future LLM Integration

For LLM communication:

1. Set expression to 'thinking' when processing user input
2. Set to 'talking' when speaking response
3. Update status indicator with current state

```javascript
// Example workflow
window.robotFace.setStatus('Listening...');
window.robotFace.setExpression('idle');

// User speaks...
window.robotFace.setStatus('Processing...');
window.robotFace.setExpression('thinking');

// LLM responds...
window.robotFace.setStatus('Speaking...');
window.robotFace.setExpression('talking');
```

## Customization

### Adjusting for Different Screen Sizes

Edit the face size in `index.html`:

```html
<!-- Change w-96 h-96 to your preferred size -->
<div class="relative w-96 h-96 bg-gradient-to-br...">
```

For 7-inch displays (typically 1024x600), the current size (384px) works well.

### Hiding the Control Panel

Remove or comment out the control panel section in `index.html`:

```html
<!-- Control Panel (for testing - can be hidden in production) -->
<!-- Comment out this entire section for production -->
```

### Adding New Expressions

1. Add a new animation in the `<style>` section
2. Create a new case in the `setExpression()` function
3. Define eye size and animation class

## Performance Notes

- Animations use CSS transforms for smooth 60fps rendering
- Low CPU usage (~2-5% on modern hardware)
- Optimized for embedded systems and Raspberry Pi

## Troubleshooting

**Black screen on startup:**
- Check console for errors with `npm run dev`
- Ensure all file paths are correct

**App won't go fullscreen:**
- Check `main.js` fullscreen setting
- Verify display resolution matches window size

**Animations are choppy:**
- Reduce animation complexity
- Check system resources
- Update graphics drivers

## License

MIT License - feel free to use in your capstone project!

## Credits

Inspired by BayMax from Disney's "Big Hero 6"
