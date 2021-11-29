import "bootstrap/dist/css/bootstrap.min.css";
import QRCode from "qrcode.react";
import { useState } from "react";
import { Formik, Form } from "formik";

import { useField } from "formik";

const FormGroupWrap = ({ isWrapped, children }) =>
  isWrapped ? <div className="form-group">{children}</div> : <>{children}</>;

const Input = ({ label, onChange, skinny, ...props }) => {
  let [field, helpers] = useField(props);
  if (onChange) field.onChange = e => onChange(e, helpers);
  if (props.value) field.value = props.value;
  return (
    <FormGroupWrap isWrapped={!skinny}>
      {label && <label>{label}</label>}
      <input className="form-control" {...props} {...field} />
    </FormGroupWrap>
  );
};

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

  // demo.idem.com.au/register?id=<connectionId>
  const qrCode = `${process.env.REACT_APP_QR_CODE}/register?claims=[dob,email]&id=${connectionId}`;

  if (data.email === "" && data.name === "" && data.DoB === "") {
    return LoginPage({ connecting: connecting, qrCode: qrCode });
  }
  
  return AccountPage({ email: data.email, name: data.name, DoB: data.DoB });
}

const LoginPage = ({ connecting, qrCode }) => {
  const initialValues = { username: "", password: "" };

  const onSubmit = async (values, actions) => {
    alert(JSON.stringify(values));
  };

  return (
    <div className="App px-16">
      <div className="font-bold text-3xl py-4 text-left">
        <h1>Register a new account</h1>
      </div>
      <div className="grid grid-cols-2 w-full text-left">
        <div className="card mr-4">
          <div className="card-header">Legacy Way</div>
          <div className="card-body">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <label htmlFor="username">Email</label>
                <Input name="username" placeholder="email" />
                <label htmlFor="password">Password</label>
                <Input name="password" type="password" placeholder="password" />
                <button
                  className="btn btn-primary btn-block relative d-flex justify-content-center"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className="mx-2">Register</span>
                </button>
              </Form>
            )}
          </Formik>

            {/* <form>
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
            </form>*/}
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
          <div>
            QR Code lists the claims for the user: {qrCode}
          </div>
        </div>
      </div>
    </div>
  );
}

const AccountPage = ({ email, name, DoB }) => {
  return (
    <div className="App px-16">
      <div className="font-bold text-3xl py-4 text-left">Welcome {email} to exchange.com</div>
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
