import express = require("express");
import * as dotenv from "dotenv";
const webSocketServer = require("websocket").server;
const https = require("https");
const http = require("http");

dotenv.config();
const app = express();
app.use(express.json());

const webSocketsServerPort = process.env.WS_PORT;
const fs = require("fs");

let server;
try {
  const privateKey: String = fs.readFileSync(process.env.PRIVATE_KEY, "utf8");
  const certificate: String = fs.readFileSync(process.env.CERTIFICATE, "utf8");
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials);
} catch (e) {
  console.error("Error while creating https server");
  server = http.createServer();
}

// Spinning the http server and the websocket server.
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

wsServer.on("request", (req) => {
  const userID = getUniqueID();
  console.log(
    new Date() +
      " Recieved a new connection from origin " +
      req.origin +
      "."
  );
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = req.accept(null, req.origin);
  clients[userID] = connection;
  console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(clients)}`);
  connection.sendUTF("connected");

  connection.on("message", (msg:String) => {
    console.log(msg);
  });
});

wsServer.on("message", (req) => {
  console.log(req);
});

app.get("/", (req: express.Request, res: express.Response) => {
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(
      JSON.stringify({
        email: "user@idem.com.au",
        name: "Mr Idem User",
        DoB: "25th December, 1984",
      })
    );
  });
  res.send("Successfully verified account");
});

app.post("/", (req: express.Request, res: express.Response) => {

  // https://www.w3.org/TR/vc-data-model/#contexts
  // {
  //   "@context": [
  //     "https://www.w3.org/2018/credentials/v1",
  //     "https://www.w3.org/2018/credentials/examples/v1"
  //   ],
  //   "id": "http://example.edu/credentials/58473",
  //   "type": ["VerifiableCredential"],
  //   "issuanceDate": "2010-01-01T19:73:24Z",
  //   "credentialSubject": {
  //     "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
  //     "alumniOf": {
  //       "id": "did:example:c276e12ec21ebfeb1f712ebc6f1",
  //       "name": [{
  //         "value": "Example University",
  //         "lang": "en"
  //       }, {
  //         "value": "Exemple d'Université",
  //         "lang": "fr"
  //       }]
  //     }
  //   },
  //   "proof": {  }
  // }

  console.log(req.body.type[0]);
  if (req.body.type[0] !== "VerifiableCredential") {
    res.status(500).send("Invalid credential type");
  }

  const dob: string = ""; //req.body.claims.filter(x => x.type === "dob").map(x => x.value);
  console.log(dob);
  const email: string = ""; //req.body.claims.filter(x => x.type === "email").map(x => x.value)[0];
  const name: string = ""; //req.body.claims.filter(x => x.type === "name").map(x => x.value)[0];

  Object.keys(clients).map((client) => {
    clients[client].sendUTF(
      JSON.stringify({
        email: email,
        name: name,
        DoB: dob[0],
      })
    );
  });

  // res.send("Successfully verified account");
  res.json({ message: "Successfully verified account" });
});

app.listen(process.env.API_PORT);
