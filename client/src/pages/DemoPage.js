import "bootstrap/dist/css/bootstrap.min.css";
import QRCode from 'qrcode.react';
import { useState } from "react";

function DemoPage({websocket}) {
  const [data, setData] = useState({email: "", name: "", DoB: ""});
  const [connecting, setConnecting] = useState(true);


  websocket.onmessage = (message) => {
    if (message.data === "connected") {
      setConnecting(false);
    } else {
      setData(JSON.parse(message.data));
    }
  };

  if (data.email === "") {
    return LoginPage({connecting: connecting});
  } else {
    return DataPage({email: data.email, name: data.name, DoB: data.DoB});
  }
}

function LoginPage({connecting}) {
  return (
    <div className="App px-16">
      <div className="font-bold text-3xl py-4 text-left">
        Register a new account
      </div>
      <div className="grid grid-cols-2 w-full text-left">
        <div className="card mr-4">
          <div className="card-header">Old Way</div>
          <div className="card-body">
            <form>
              <div className="form-group pb-4">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group pb-4">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
          </div>
        </div>
        <div className="card ml-4">
          <div className="card-header">Idem Way</div>
            <div className="card-body grid place-items-center">
              {connecting ? <div> Connecting </div>
              : <QRCode size={150} value={process.env.REACT_APP_QR_CODE} />}
          </div>
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
        <div className="border-2 border-black px-16 py-4 mr-4">
          <form>
            <div className="form-group pb-4">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
              />
            </div>
            <div className="form-group pb-4">
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                className="form-control"
                id="Name"
                placeholder="Name"
                value={name}
              />
            </div>
            <div className="form-group pb-4">
              <label htmlFor="DateOfBirth">Date Of Birth</label>
              <input
                type="text"
                className="form-control"
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
