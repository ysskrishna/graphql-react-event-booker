import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import LoginView from "./views/auth/login";
import RegisterView from "./views/auth/register";
import BookingsView from "./views/bookings";
import EventsView from "./views/events";
import AuthContext from './context';


class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };
  
  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}
        >
          <Switch>
            {this.state.token && <Redirect from="/" to='/events' exact />}
            {this.state.token && <Redirect from="/login" to='/events' exact />}
            {!this.state.token && <Route path="/login" component={LoginView} />}
            {!this.state.token && <Route path="/register" component={RegisterView} />}
            <Route path="/events" component={EventsView} />
            {this.state.token && <Route path="/bookings" component={BookingsView} />}
            {!this.state.token && <Redirect to='/login' exact />}
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
