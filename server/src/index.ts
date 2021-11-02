import express = require("express");
import cors = require("cors");
import * as dotenv from "dotenv";
import WebSocketService from "./websocket";

dotenv.config();
const app = express();
const webSocket = new WebSocketService();
app.use(express.json())
app.use(cors());

app.get("/", (req: express.Request, res: express.Response) => {
  if (req.query.id) {
    webSocket.verifyUser(req.query.id.toString(), {email: "user@idem.com.au", name: "Mr Idem User", DoB: "1984-12-25"});
  }
  res.send("Successfully verified account");
});

app.post("/", (req, res, next) => {
  const identity = req.body as server.IdentityRequestData;
  // if (!claim.type.includes("VerifiableCredential")) {
  //   res.status(500).send("Invalid credential type");
  // }

  const dob: string | undefined = identity.claims.find(c => c.credentialSubject[0].name === "DoB")?.credentialSubject[0]?.value;
  const email: string | undefined = identity.claims.find(c => c.credentialSubject[0].name === "Email")?.credentialSubject[0]?.value;
  const name: string | undefined = identity.claims.find(c => c.credentialSubject[0].name === "Name")?.credentialSubject[0]?.value;

  webSocket.verifyUser(identity.connectionID, {name: name, email: email, DoB: dob})

  // res.send("Successfully verified account");
  res.json({ message: "Successfully verified account" });
});

app.listen(process.env.API_PORT);
