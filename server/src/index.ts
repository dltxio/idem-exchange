import express = require('express');
const webSocketsServerPort = 3002;
const webSocketServer = require('websocket').server;
const http = require('http');

const app = express();

// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
});

// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};
wsServer.on('request', function(request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));
  connection.sendUTF("connected");

  connection.on('message', function(msg) {
    console.log(msg);
  })
});

wsServer.on('message', function(request) {
  console.log(request);
});

app.get("/", function (req, res, next) {
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(JSON.stringify({email: "user@idem.com", name: "Mr Idem User", DoB: "25th December, 1984"}));
  });
  res.send("test");
});

app.listen("3001");