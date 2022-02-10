import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/Login/Login";
import AccountPage from "./pages/Account/Account";

const App = () => {
  const [claimData, setClaimData] = useState(null);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage setClaimData={setClaimData} />
        </Route>
        <Route exact path="/account">
          <AccountPage claimData={claimData}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
