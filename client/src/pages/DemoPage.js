import "bootstrap/dist/css/bootstrap.min.css";
import QRCode from "qrcode.react";
import { useState } from "react";

const DemoPage = ({ websocket }) => {
  const [data, setData] = useState({ email: "", name: "", DoB: "" });
  const [connectionId, setConnectionId] = useState(undefined);
  const [connecting, setConnecting] = useState(true);

  websocket.onmessage = messageData => {
    try {
      const message = JSON.parse(messageData.data);
      if (message.id) {
        setConnectionId(message.id);
        setConnecting(false);
      } else {
        setData(message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const qrCode = `${process.env.REACT_APP_QR_CODE}?id=${connectionId}`;

  if (data.email === "") {
    return LoginPage({ connecting: connecting, qrCode: qrCode });
  }
  
  return DataPage({ email: data.email, name: data.name, DoB: data.DoB });
}

const LoginPage = ({ connecting, qrCode }) => {
  return (
    <div className="App px-16">
      <div className="font-bold text-3xl py-4 text-left">
        <h1>Register a new account</h1>
      </div>
      <div className="grid grid-cols-2 w-full text-left">
        <div className="card mr-4">
          <div className="card-header">Legacy Way</div>
          <div className="card-body">
            <form>
              <div className="form-group pb-4">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="user@idem.com.au"
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
            {connecting ? (
              <div> Connecting </div>
            ) : (
              <QRCode size={150} value={qrCode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const DataPage = ({ email, name, DoB }) => {
  return (
    <div className="App px-16">
      <div className="font-bold text-3xl py-4 text-left">Your account</div>
      <div className="grid grid-cols-2 w-full text-left">
        <div className="card mr-4">
          <div className="card-header">Details</div>
          <div className="card-body">
            <form>
              <div className="form-group pb-4">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="user@idem.com.au"
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
        </div>
        <div className="card ml-4">
          <div className="card-header">Proofs</div>
          <div className="card-body"></div>
        </div>
      </div>
    </div>
  );
}

export default DemoPage;
