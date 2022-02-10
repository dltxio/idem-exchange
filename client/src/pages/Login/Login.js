import QRCode from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import './styles.css';

const CLAIM_CATEGORIES =['0x01', '0x02'];

const LoginPage = ({ setClaimData }) => {
  const [clientID, setClientID] = useState(null);
  const id = useRef(uuid())
  const history = useHistory();
  
  useEffect(() => {
    const idem = new EventSource(`${process.env.REACT_APP_API_URL}/idem`);

    idem.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // If the event is an initializer event, set the client ID so that the callback url can be created
      if (message.type === 'init') {
        setClientID(message.data.clientId);
      } else if (message.type === 'idem-response') {
        setClaimData(message.data);
        idem.close();
        history.push('/account');
      }
    };
  }, []);

  function getQRCodeURL() {
    let queryClaims = "";
    CLAIM_CATEGORIES.forEach((claim) => {
      queryClaims += `&claim=${claim}`
    })

    const callbackUrl = (Buffer.from(`${process.env.REACT_APP_API_URL}/idem/${clientID}`)).toString('base64');
    return `${process.env.REACT_APP_QR_CODE}/pretend-idem?nonce=${id.current}${queryClaims}&callback=${callbackUrl}`;
  }

  return (
    <div id="login">
      <h1>
        Login Page
      </h1>
      <div>
      </div>
      <QRCode value={getQRCodeURL()} />
      <button onClick={() => fetch(getQRCodeURL())}>Click here</button>
    </div>
  );
}

export default LoginPage;
