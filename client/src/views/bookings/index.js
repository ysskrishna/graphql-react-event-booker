import React, { Component } from 'react';
import HeaderBar from '../../components/HeaderBar';

class Auth extends Component {
  render() {
    return (
      <div>
        <HeaderBar active="bookings" />
        Bookings Component
      </div>
    );
  }
}

export default Auth;
