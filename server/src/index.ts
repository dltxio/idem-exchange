import * as express from 'express';
import * as cors from 'cors';
import { config } from "dotenv";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { ethers, Wallet } from 'ethers';

config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// INIT IDEM CLIENTS
type ClientMap = {
  [key: string]: express.Response;
}

const clients: ClientMap = {};

app.get('/', (req, res) => {
  res.send('Server is running');
})

// Function to create open connection
// https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
function IDEMListener(req: express.Request, res: express.Response) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  }
  res.writeHead(200, headers);

  const clientId = uuid();
  clients[clientId] = res;

  const initialData: server.ServerSentEvent = {
    type: 'init',
    data: {
      clientId: clientId,
    }
  }
  // Writes the initial data to the data part of the response payload
  res.write(`data: ${JSON.stringify(initialData)}\n\n`);

  // Removes client and ends connection on close
  req.on('close', () => {
    delete clients[clientId];
    res.end();
  })
}

// Opens the server sent events connection 
app.get("/idem", IDEMListener);

// Checks claim data signatures for validity
function areValidClaims(claims: any) {
  for (let key of Object.keys(claims)) {
    const recoveredAddress = ethers.utils.verifyMessage(claims[key].data, claims[key].signature);
    if (recoveredAddress.toLowerCase() != process.env.IDEM_PUBLIC_KEY.toLowerCase()) {
      console.log(`INVALID SIGNER => Signer: ${recoveredAddress}, Idem: ${process.env.IDEM_PUBLIC_KEY}`);
      return false;
    }
  }
  return true;
}

// Receives data from Idem callback, stores it and sends it to the client
app.post("/idem/:id", (req, res) => {
  const claims = req.body.claims;
  const clientId = req.params.id;

  if (!areValidClaims(claims)) {
    return res.status(400).send("Invalid claims");
  }

  const response: server.ServerSentEvent = {
    type: 'idem-response',
    data: {
      claims
    }
  }

  if (clients[clientId]) {
    clients[clientId].write(`data: ${JSON.stringify(response)}\n\n`);
    delete clients[clientId];
    res.end();
  } else {
    res.sendStatus(400);
  }
});

app.listen(process.env.API_PORT);
