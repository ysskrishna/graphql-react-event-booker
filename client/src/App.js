import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthView from "./views/auth";
import BookingsView from "./views/bookings";
import EventsView from "./views/events";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to='/auth' exact="/" />
        <Route path="/auth" component={AuthView} />
        <Route path="/events" component={EventsView} />
        <Route path="/bookings" component={BookingsView} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
