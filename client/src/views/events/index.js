import React, { Component } from 'react';
import HeaderBar from '../../components/HeaderBar';
import { Container, Segment } from 'semantic-ui-react';
import { baseUrl } from '../../config/common';
import AuthContext from '../../context';
import { Button, Form, Grid, Header, Loader, Card } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';

class Events extends Component {
  state = {
    title: "",
    date: "",
    price: "",
    description: "",
    events: [],
    loadingEvents: false,
    bookingEvent: false,
    eventId: null
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvents();
  }

  onChange(e) {
    console.log(this.state);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = () => {
    const { title, date, description } = this.state;
    const price = +this.state.price;
    if (title.trim().length === 0 || date.trim().length === 0 || description.trim().length === 0 || price <= 0) {
      return;
    };

    let requestBody = {
      query: `
      mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
        createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
          _id
          title
          description
          date
          price
        }
      }
    `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
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
        console.log(resData);
        this.setState({
          events: [...this.state.events, {
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId
            }
          }]
        })
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchEvents() {
    this.setState({ loadingEvents: true });

    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        this.setState({ events: events, loadingEvents: false });
      })
      .catch(err => {
        this.setState({ loadingEvents: false });
        console.log(err);
      });
  };

  bookEvent = (eventId) => {
    if (!this.context.token) {
      return;
    };
    this.setState({ bookingEvent: true, eventId });
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId: "${eventId}") {
              _id
             createdAt
             updatedAt
            }
          }
        `
    };
    console.log("request", requestBody);
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
        console.log(resData);
        this.setState({ bookingEvent: false, eventId: null });
      })
      .catch(err => {
        console.log(err);
        this.setState({ bookingEvent: false, eventId: null });
      });
  }

  AddEventForm = () => {
    return (
      <Grid textAlign='center' verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size='large'>
            <Segment stacked>
              <Form.Input
                required
                value={this.state.title}
                fluid
                onChange={e => this.onChange(e)}
                name="title"
                placeholder='Event title'
              />
              <Form.Input
                required
                value={this.state.price}
                type="Number"
                fluid
                onChange={e => this.onChange(e)}
                name="price"
                placeholder='Event price'
              />
              <Form.Input
                required
                type="datetime-local"
                value={this.state.date}
                fluid
                onChange={e => this.onChange(e)}
                name="date"
                placeholder='Event date'
              />
              <Form.TextArea
                required
                value={this.state.description}
                fluid
                rows="2"
                onChange={e => this.onChange(e)}
                name="description"
                placeholder='Event description'
              />

              <Button color='teal' fluid size='large' onClick={this.handleSubmit}>
                Add Event
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }



  render() {
    const userId = this.context.userId;
    return (
      <div>
        <HeaderBar active="events" />
        <Container text style={{ marginTop: '2em' }}>
          <Loader active={this.state.loadingEvents} inline='centered' />

          {
            this.context.token && <Segment placeholder>
              {this.AddEventForm()}
            </Segment>
          }

          <Card.Group centered>
            {this.state.events.map(e => {
              return (
                <Card>
                  <Card.Content>
                    <Card.Header>{e.title}</Card.Header>
                    <Card.Meta>{'$' + e.price} - {new Date(e.date).toLocaleDateString()}</Card.Meta>
                    <Card.Description>
                      {e.description}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    {userId === e.creator._id ? (
                      <p>You are the owner of this event.</p>
                    ) : (
                        <React.Fragment>
                          {this.context.token && <Button color='teal' onClick={() => this.bookEvent(e._id)} loading={this.state.bookingEvent && this.state.eventId === e._id}>Book Event</Button>}
                          {!this.context.token && <NavLink to='/login'><Button color='teal'>Login & book Event</Button></NavLink>}
                        </React.Fragment>
                      )}
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

export default Events;
