import * as express from 'express';
import * as cors from 'cors';
import { config } from "dotenv";
import { v4 as uuid } from "uuid";

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

// Create open connection
// https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
function IDEMListener(req: express.Request, res: express.Response) {
  const headers = {
    'Content-Type': 'application/json',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  }
  res.writeHead(200, headers);

  const clientId = uuid();
  clients[clientId] = res;

  const initialData = {
    type: 'init',
    data: {
      clientId: clientId,
    }
  }
  res.write(JSON.stringify(initialData));
}

// Opens the event listener on the client side
app.get("/idem", IDEMListener);

// Receives data from idem, stores it and sends it to the client
app.post("/idem", (req, res) => {
  const claims = req.body.claims;
  // Metadata includes clientId
  const metadata = req.body.metadata;
  const clientId = metadata.clientId;

  // logs idem data
  console.log(req.body);

  clients[clientId].write(JSON.stringify(claims));
  res.sendStatus(200);
});

app.listen(process.env.API_PORT);
