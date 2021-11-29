import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import DemoPage from "../pages/DemoPage";

const client = new W3CWebSocket(process.env.REACT_APP_WS_URL);
const userId = "testUser";

class Websocket extends Component {
  componentDidMount() {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onClose = () => {
      console.log("closed websocket");
    };
  }

  render() {
    return (
      <div>
        <DemoPage websocket={client} />
      </div>
    );
  }

  /* When a user joins, I notify the
  server that a new user has joined to edit the document. */
  logInUser = () => {
    client.send("test");
  };

  /* When content changes, we send the
  current content of the editor to the server. */
  onEditorStateChange = text => {
    client.send(
      JSON.stringify({
        type: "contentchange",
        username: userId,
        content: text
      })
    );
  };
}

export default Websocket;
