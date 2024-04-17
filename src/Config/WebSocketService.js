import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.socket = new SockJS("http://13.213.208.92:8080/ecscrm/ws");
    this.stompClient = Stomp.over(this.socket);
    // this.stompClient.debug = false; // Disable debug logging
    this.connected = false;
    this.connect(() => {
      this.connected = true;
    });
  }

  connect(callback) {
    this.stompClient.connect({}, () => {
      console.log("Connected to WebSocket");
      if (callback) {
        callback();
      }
    });
  }

  subscribeToLeadUpdates(callback) {
    if (!this.connected) {
      console.error("STOMP connection not established");
      return;
    }
    this.stompClient.subscribe("/topic/leadGeneration", (response) => {
      console.log(response);
      callback(JSON.parse(response.body));
    });
  }

  subscribeToAppointmentUpdates(callback) {
    if (!this.connected) {
      console.error("STOMP connection not established");
      return;
    }
    this.stompClient.subscribe("/topic/appointmentBooking", (response) => {
      console.log(response);
      callback(JSON.parse(response.body));
    });
  }
}

export default new WebSocketService();
