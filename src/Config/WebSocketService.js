import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    // this.socket = new SockJS("http://13.213.208.92:8080/ecscrm/ws");
    this.socket = new SockJS("https://crmlah.com/ecscrm/ws");
    this.stompClient = Stomp.over(this.socket);
    // this.stompClient.debug = false; // Disable debug logging
    this.connected = false;
    this.connect(() => {
      this.connected = true;
    });
    this.pendingSubscriptions = []; // Queue for pending subscriptions
  }

  // connect(callback) {
  //   this.stompClient.connect({}, () => {
  //     console.log("Connected to WebSocket");
  //     if (callback) {
  //       callback();
  //     }
  //   });
  // }

  connect(callback) {
    if (this.connected) {
      console.warn("Connection already active; skipping reactivation.");
      if (callback) {
        callback();
      }
      return;
    }
  
    this.stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      this.connected = true; // Update connection state
      if (callback) {
        callback();
      }
  
      // Process any queued subscriptions
      while (this.pendingSubscriptions.length > 0) {
        const subscriptionCallback = this.pendingSubscriptions.shift();
        subscriptionCallback();
      }
    });
  }
  
  // subscribeToLeadUpdates(callback) {
  //   if (!this.connected) {
  //     console.error("STOMP connection not established");
  //     return;
  //   }
  //   this.stompClient.subscribe("/topic/leadGeneration", (response) => {
  //     console.log("Received lead update");
  //     console.log(response);
  //     callback(JSON.parse(response.body));
  //   });
  // }

  // subscribeToAppointmentUpdates(callback) {
  //   if (!this.connected) {
  //     console.error("STOMP connection not established");
  //     return;
  //   }
  //   this.stompClient.subscribe("/topic/appointmentBooking", (response) => {
  //     console.log("Received appointment update");
  //     console.log(response);
  //     callback(JSON.parse(response.body));
  //   });
  // }

  subscribeToPaymentUpdates(callback) {
    const subscribeCallback = () => {
      this.stompClient.subscribe("/topic/payment", (response) => {
        console.log("Received payment data");
        callback(JSON.parse(response.body));
      });
    };

    if (this.connected) {
      subscribeCallback();
    } else {
      console.warn("STOMP connection not established; queuing subscription.");
      this.pendingSubscriptions.push(subscribeCallback);
      this.connect(); // Ensure the WebSocket connection is initiated
    }
  }

  subscribeToLeadUpdates(callback) {
    const subscribeCallback = () => {
      this.stompClient.subscribe("/topic/leadGeneration", (response) => {
        console.log("Received payment data");
        callback(JSON.parse(response.body));
      });
    };
    if (this.connected) {
      subscribeCallback();
    } else {
      console.warn("STOMP connection not established; queuing subscription. ");
      this.pendingSubscriptions.push(subscribeCallback);
      this.connect(); // Ensure the WebSocket connection is initiated
    }
  }

  subscribeToAppointmentUpdates(callback) {
    const subscribeCallback = () => {
      this.stompClient.subscribe("/topic/appointmentBooking", (response) => {
        console.log("Received payment data");
        callback(JSON.parse(response.body));
      });
    };
    if (this.connected) {
      subscribeCallback();
    } else {
      console.warn("STOMP connection not established; queuing subscription.");
      this.pendingSubscriptions.push(subscribeCallback);
      this.connect(); // Ensure the WebSocket connection is initiated
    }
  }

  newData(message) {
    if (!this.connected) {
      console.error("STOMP connection not established");
      return;
    }
    this.stompClient.send("/app/newData", {}, JSON.stringify(message));
  }
}

export default new WebSocketService();
