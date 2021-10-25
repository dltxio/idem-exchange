import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import Demo from "./pages/DemoPage";

export const history = createBrowserHistory();

const CatchAllRoute = ({ component, ...props }) => {
  const Component = component;
  return (
    <Route
      {...props}
      render={() => {
        return <Component /> ;
      }}
    />
  );
};

const Navigation = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" component={Demo} exact />
        <CatchAllRoute path="*" component={Demo} />
      </Switch>
    </Router>
  );
};

export default Navigation;
