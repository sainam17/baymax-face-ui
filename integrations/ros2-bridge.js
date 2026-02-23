// ros2-bridge.js - Example ROS2 Integration
// This file shows how to integrate ROS2 with the BayMax face UI
// Uncomment and modify when ready to integrate with ROS2

/*
const rclnodejs = require('rclnodejs');

class ROS2FaceBridge {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.node = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Initialize ROS2
      await rclnodejs.init();
      
      // Create node
      this.node = rclnodejs.createNode('baymax_face_node');
      
      // Subscribe to expression commands
      this.expressionSubscription = this.node.createSubscription(
        'std_msgs/msg/String',
        '/robot/face/expression',
        (msg) => {
          console.log('Received expression command:', msg.data);
          this.mainWindow.webContents.send('change-expression', msg.data);
        }
      );

      // Subscribe to status updates
      this.statusSubscription = this.node.createSubscription(
        'std_msgs/msg/String',
        '/robot/face/status',
        (msg) => {
          console.log('Received status update:', msg.data);
          this.mainWindow.webContents.send('update-status', msg.data);
        }
      );

      // Subscribe to navigation state
      this.navSubscription = this.node.createSubscription(
        'std_msgs/msg/String',
        '/robot/navigation/state',
        (msg) => {
          this.handleNavigationState(msg.data);
        }
      );

      // Create publisher for face events
      this.eventPublisher = this.node.createPublisher(
        'std_msgs/msg/String',
        '/robot/face/events'
      );

      // Start spinning
      rclnodejs.spin(this.node);
      
      this.initialized = true;
      console.log('ROS2 Face Bridge initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize ROS2 bridge:', error);
    }
  }

  handleNavigationState(state) {
    // Map navigation states to facial expressions
    const stateExpressionMap = {
      'idle': 'idle',
      'navigating': 'scanning',
      'obstacle_detected': 'surprised',
      'goal_reached': 'happy',
      'planning': 'thinking'
    };

    const expression = stateExpressionMap[state] || 'idle';
    this.mainWindow.webContents.send('change-expression', expression);
  }

  publishEvent(eventType, data) {
    if (!this.initialized) return;
    
    const msg = {
      data: JSON.stringify({ type: eventType, data: data })
    };
    
    this.eventPublisher.publish(msg);
  }

  shutdown() {
    if (this.node) {
      this.node.destroy();
    }
    if (this.initialized) {
      rclnodejs.shutdown();
    }
  }
}

module.exports = ROS2FaceBridge;
*/

// TO USE THIS BRIDGE:
// 
// 1. Install rclnodejs:
//    npm install rclnodejs --break-system-packages
//
// 2. In main.js, uncomment and add:
//    const ROS2FaceBridge = require('./ros2-bridge.js');
//    let ros2Bridge;
//
//    After creating the window:
//    ros2Bridge = new ROS2FaceBridge(mainWindow);
//    ros2Bridge.initialize();
//
// 3. Add IPC listeners in main.js:
//    ipcMain.on('face-event', (event, data) => {
//      if (ros2Bridge) {
//        ros2Bridge.publishEvent(data.type, data.data);
//      }
//    });
//
// 4. In index.html, add at the top of script section:
//    const { ipcRenderer } = require('electron');
//
//    ipcRenderer.on('change-expression', (event, expression) => {
//      window.robotFace.setExpression(expression);
//    });
//
//    ipcRenderer.on('update-status', (event, status) => {
//      window.robotFace.setStatus(status);
//    });
//
// 5. ROS2 Topics:
//    Subscribe: /robot/face/expression (String) - Change expression
//    Subscribe: /robot/face/status (String) - Update status text
//    Subscribe: /robot/navigation/state (String) - Navigation state
//    Publish: /robot/face/events (String) - Face UI events
//
// 6. Test with ROS2 commands:
//    ros2 topic pub /robot/face/expression std_msgs/msg/String "data: 'happy'"
//    ros2 topic pub /robot/face/status std_msgs/msg/String "data: 'Navigating to kitchen'"
