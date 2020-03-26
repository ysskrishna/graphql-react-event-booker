import React, { Component } from 'react';
import HeaderBar from '../../components/HeaderBar';
import AuthContext from '../../context';
import { baseUrl } from '../../config/common';
import { Button, Form, Grid, Header, Loader, Card, Container } from 'semantic-ui-react'

class Auth extends Component {
  state = {
    bookings: [],
    loadingBookings: false,
    cancelBooking: false,
    bookingId: null
  };

  static contextType = AuthContext;
  componentDidMount() {
    this.fetchBookings();
  };

  fetchBookings = () => {
    this.setState({ loadingBookings: true });

    const requestBody = {
      query: `
          query {
            bookings {
              _id
            createdAt
            event {
              _id
              title
              date
              price
            }
            }
          }
        `
    };
    const token = this.context.token;

    fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings, loadingBookings: false });
      })
      .catch(err => {
        this.setState({ loadingBookings: false });
        console.log(err);
      });
  };

  deleteBooking = (bookingId) => {
    if (!this.context.token) {
      return;
    };
    this.setState({ cancelBooking: true, bookingId });
    const requestBody = {
      query: `
      mutation CancelBooking($id: ID!) {
        cancelBooking(bookingId: $id) {
        _id
         title
        }
      }
    `,
      variables: {
        id: bookingId
      }
    };

    fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, isLoading: false, bookingId: null };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false, bookingId: null });
      });
  }
  render() {
    return (
      <div>
        <HeaderBar active="bookings" />
        <Container text style={{ marginTop: '2em' }}>
          <Loader active={this.state.loadingBookings} inline='centered' />
          <Card.Group centered>
            {this.state.bookings.map(bkg => {
              return (
                <Card>
                  <Card.Content>
                    <Card.Header>{bkg.event.title}</Card.Header>
                    <Card.Meta>{'$' + bkg.event.price} - {new Date(bkg.event.date).toLocaleDateString()}</Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    {
                      this.context.token && <Button color='red'
                        onClick={() => this.deleteBooking(bkg._id)}
                        loading={this.state.cancelBooking && this.state.bookingId === bkg._id}
                      >Delete Event</Button>
                    }
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </Container>
      </div>
    );
  }
}

export default Auth;
