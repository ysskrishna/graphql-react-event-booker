import React, { Component } from 'react';
import HeaderBar from '../../components/HeaderBar';
import { Container, Segment } from 'semantic-ui-react';
import { baseUrl } from '../../config/common';
import AuthContext from '../../context';
import { Button, Form, Grid, Header, Placeholder, Loader, Card } from 'semantic-ui-react'

class Events extends Component {
  state = {
    title: "",
    date: "",
    price: "",
    description: "",
    events: [],
    loadingEvents: false
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
        mutation {
          createEvent(eventInput:{title:"${title}",description:"${description}", price:${price}, date: "${date}"}) {
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
    console.log("event", requestBody);
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
        this.fetchEvents();
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
        console.log(err);
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

          {this.state.events.map(e => {
            return (
              <Card
                header={e.title}
                meta={'$' + e.price}
                description={e.description}
              />
            );
          })}

        </Container>
      </div>
    );
  }
}

export default Events;
