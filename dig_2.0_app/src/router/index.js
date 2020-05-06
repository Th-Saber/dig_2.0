import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import ErrorPage from "@layouts/404Pages/Error404";

import config from "./config";

export default class RoutePages extends Component {
  constructor() {
    super();
  }
  //  修改tkt
  checkTkt = () => {
    //   if (localStorage.userdata){

    //   }
    return true;
  };
  render() {
    return (
      <Router>
        <Switch>
          {config.map((item, index) => {
            return (
              <Route
                key={index + "route"}
                path={item.path}
                exact
                render={(props) =>
                  !item.auth ? (
                    <item.component {...props} />
                  ) : localStorage.userdata ? (
                    <item.component {...props} />
                  ) : (
                    <Redirect
                      to={{
                        pathname: "/login",
                        state: { from: item.path },
                      }}
                    />
                  )
                }
              />
            );
          })}
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    );
  }
}
