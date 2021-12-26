import { BrowserRouter as Router ,Switch, Route, Link  } from "react-router-dom";
import App from "../App";
import Login from "../components/login/Login";

const Navigation = (

    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/contact">
          {/* <Contact /> */}
        </Route>
      </Switch>
    </Router>
  );

