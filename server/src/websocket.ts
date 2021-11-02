import * as dotenv from "dotenv";
const webSocketServer = require("websocket").server;
const https = require("https");
const http = require("http");
const fs = require('fs');
dotenv.config();

export default class WebSocketService {

  private webSocketsServerPort = process.env.WS_PORT;
  private clients: Map<string, any>;
  private wsServer: any;

  constructor() {
    var server;
    try {
      const privateKey = fs.readFileSync(process.env.privateKey, "utf8");
      const certificate = fs.readFileSync(process.env.certificate, "utf8");
      const credentials = { key: privateKey, cert: certificate };
      server = https.createServer(credentials);
    } catch (e) {
      server = http.createServer();
    }

    // This code generates unique userid for everyuser.
    const getUniqueID = () => {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4();
    };

  
    // Spinning the http server and the websocket server.
    server.listen(this.webSocketsServerPort);
    this.wsServer = new webSocketServer({
      httpServer: server
    });
    this.clients = new Map;

    this.wsServer.on('request', (request: { origin: string; accept: (arg0: null, arg1: any) => any; }) => {
      var userID = getUniqueID();
      const connection = request.accept(null, request.origin);
      this.clients.set(userID, connection);
      connection.sendUTF(JSON.stringify({id: userID}));
      
      console.log(this.clients.keys());
      connection.on('message', function(msg: any) {
        console.log(msg);
      })
    });
  
    this.wsServer.on('close', (request: any) => {
      const client = Array.from(this.clients.entries()).find((client) => client[1] === request);
      if (client) {
        this.clients.delete(client[0]);
      }
    });
  }

  public verifyUser = (id: string, identityData: any) => {
    if (this.clients.get(id)) {
      this.clients.get(id).sendUTF(JSON.stringify(identityData));
      this.clients.get(id).close();
    }
  }

}