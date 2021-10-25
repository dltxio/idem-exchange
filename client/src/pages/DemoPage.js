import "bootstrap/dist/css/bootstrap.min.css";
import Websocket from "../components/Websocket";
import QRCode from 'qrcode.react';
import { useState } from "react";

function DemoPage({websocket}) {
  const [data, setData] = useState({email: "", name: "", DoB: ""});

  websocket.onmessage = (message) => {
    console.log(message.data);
    setData(JSON.parse(message.data));
  };

  if (data.email === "") {
    return LoginPage();
  } else {
    return DataPage({email: data.email, name: data.name, DoB: data.DoB});
  }
  
}

function LoginPage() {
  return (
    <div className="App px-16">
      <div className="font-bold text-3xl py-4 text-left">
        Register a new account
      </div>
      <div className="grid grid-cols-2 w-full text-left">
      <div>old way</div>
      <div className="ml-4">idem way</div>
        <div class="border-2 border-black px-16 py-4 mr-4">
          <form>
            <div class="form-group pb-4">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
            </div>
            <div class="form-group pb-4">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <button type="submit" class="btn btn-primary">
              Register
            </button>
          </form>
        </div>
        <div className="border-2 border-black grid place-items-center ml-4">
          <button type="button" class="btn btn-primary h-25">
            QR Code Placeholder
          </button>
          <QRCode size={150} value="http://demo.idem.com.au:3001" />
        </div>
      </div>
    </div>
  );
}

function DataPage({email, name, DoB}) {
  return (
    <div className="App px-16">
      <div className="font-bold text-3xl py-4 text-left">
        Your account
      </div>
      <div className="grid grid-cols-2 w-full text-left">
      <div>Details</div>
      <div className="ml-4">Proofs</div>
        <div class="border-2 border-black px-16 py-4 mr-4">
          <form>
            <div class="form-group pb-4">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
              />
            </div>
            <div class="form-group pb-4">
              <label for="Name">Name</label>
              <input
                type="text"
                class="form-control"
                id="Name"
                placeholder="Name"
                value={name}
              />
            </div>
            <div class="form-group pb-4">
              <label for="DateOfBirth">Date Of Birth</label>
              <input
                type="text"
                class="form-control"
                id="DateOfBirth"
                placeholder="DoB"
                value={DoB}
              />
            </div>
          </form>
        </div>
        <div className="border-2 border-black grid place-items-center ml-4">
        </div>
      </div>
    </div>
  );
}

export default DemoPage;
