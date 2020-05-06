import React, { useEffect } from "react";
import RoutePages from "@router";
import store from "@store";
import { Provider } from "react-redux";
import { save_user } from "@store/action";
import socket from "@serve";

export default function App() {
  useEffect(() => {
    socket.connct();
    if (localStorage.userdata) {
      let userdata = JSON.parse(localStorage.userdata);
      store.dispatch(save_user(userdata));
    }
  });
  return (
    <Provider store={store}>
      <RoutePages />
    </Provider>
  );
}
