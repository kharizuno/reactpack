import React, {Component} from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import routes from "./routes";

class App extends Component {
  constructor(props) {
    super();
    // console.log(process.env);
  }

  render() {
    const { history } = this.props;

    return (
      <Router history={history} basename="/">
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
            // <Route key={i} {...route} />
          ))}
        </Switch>
      </Router>
    );
  }
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

export default App;
