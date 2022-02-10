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
function areValidClaims(claims: any[]) {
  for (let key of Object.keys(claims)) {
    const recoveredAddress = ethers.utils.verifyMessage(claims[key].data, claims[key].signature);
    if (recoveredAddress !== process.env.IDEM_PUBLIC_KEY) {
      console.log(recoveredAddress)
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

// THIS SHOULD BE ON IDEM APP. THIS ONLY EXISTS FOR TESTING PURPOSES
const claimNonce = {}

// IDEM PRIVATE KEY WILL NOT BE AVAILABLE TO API IN PRODUCTION
const signer = new Wallet(process.env.IDEM_PRIVATE_KEY);

// Example response from client

const exampleClientClaims = {
  1: {
    data: "John Smith",
    signature: "0xc869c8d5dd9613a4956633a6f94800876d91a12a2ee4aae08fbad0529a9d5ae42cb6ed46ce3f12c3370fb60fba730b7b3016262097eb99b7aca8c49eb121e5691c"
  },
  2: {
    data: "19/12/1952",
    signature: "0xa1bedbca7ff88461ad69152832dd7bd2c4b64e341e65a8f3c7a81590715c6ce51ea8cc8dd7be1482bfda2ff131018eb68c4c9c9666f757805f99ce54b1d81e6e1b"
  }
}

app.get("/pretend-idem", (req, res) => {
  const { claim, nonce, callback } = req.query;

  if (!validateQuery(claim, nonce, callback)) {
    return res.sendStatus(400);
  }

  if (claimNonce[nonce as string]) {
    return res.sendStatus(400);
  } else {
    claimNonce[nonce as string] = true;
  }

  const claims = (claim as string[]).map(claim => Number(claim));

  const claimResponse = {};
  claims.forEach(claim => {
    claimResponse[claim] = exampleClientClaims[claim];
  });

  const callbackFromBase64 = Buffer.from(callback as string, 'base64').toString('ascii');

  axios.post(callbackFromBase64, {
    claims: claimResponse
  })
})

// not implemented properly
function validateQuery(claim, nonce, callback) {
  if (!claim || !nonce || !callback) {
    return false;
  }
  return true;
}
// END IDEM APP TESTING

app.listen(process.env.API_PORT);
