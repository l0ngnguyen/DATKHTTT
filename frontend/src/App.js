import React from "react";
import './App.scss';
import 'antd/dist/antd.css';
import Homepage from "./components/Homepage";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SignUpModal from "./components/Register/SignUpWithGG";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route path="/sign-in">
          <Login />
        </Route>
        <Route path="/sign-up">
          <Register />
        </Route>
        <Route path="/sign-up-with-google">
          <SignUpModal />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
