import express = require("express");
import cors = require("cors");
import * as dotenv from "dotenv";
import WebSocketService from "./websocket";

dotenv.config();
const app = express();
const webSocket = new WebSocketService();
app.use(express.json());
app.use(cors());

// obsolte
// Fake route to send cliams to the client
app.get("/login", (req: express.Request, res: express.Response) => {
  if (req.query.id) {
    webSocket.verifyUser(req.query.id.toString(), {
      email: "user@idem.com.au",
      name: "Mr Idem User",
      DoB: "1984-12-25",
    });
  }
  res.send("Successfully verified account");
});

app.get("/register", (req: express.Request, res: express.Response) => {
  if (req.query.id) {
    webSocket.verifyUser(req.query.id.toString(), {
      email: "user@idem.com.au",
      name: "Mr Idem User",
      DoB: "1984-12-25",
    });
  }
  res.send("Successfully verified account");
});


app.post("/register", (req, res, next) => {
  const identity = req.body as server.IdentityRequestData;

  const dob: string | undefined = identity.claims.find((c) => c.credentialSubject.name === "DoB")?.credentialSubject?.value;
  const email: string | undefined = identity.claims.find((c) => c.credentialSubject.name === "Email")?.credentialSubject?.value;
  const name: string | undefined = identity.claims.find((c) => c.credentialSubject.name === "Name")?.credentialSubject?.value;

  webSocket.verifyUser(identity.connectionID, {
    name: name,
    email: email,
    DoB: dob,
  });

  res.json({ message: "Successfully verified account" });
});

app.post("/login", (req, res, next) => {

});

app.listen(process.env.API_PORT);
