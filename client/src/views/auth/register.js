import React, { Component } from 'react';
import HeaderBar from '../../components/HeaderBar';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';
import { baseUrl } from '../../config/common';

class Register extends Component {
  state = {
    email: "",
    password: ""
  };

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  };


  handleSubmit = () => {
    const { email, password } = this.state;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    };
    let requestBody = {
      query: `
        mutation CreateUser($email: String!, $password: String!) {
          createUser(userInput: {email: $email, password: $password}) {
            _id
            email
          }
        }
    `,
      variables: {
        email: email,
        password: password
      }
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
        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      });

  };

  RegisterForm = () => {
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Create a new account
        </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input
                type="email"
                required
                value={this.state.email}
                fluid
                onChange={e => this.onChange(e)}
                name="email"
                icon='user'
                iconPosition='left'
                placeholder='E-mail address'
              />
              <Form.Input
                required
                fluid
                value={this.state.password}
                name="password"
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                onChange={e => this.onChange(e)}
              />
              <Button color='teal' fluid size='large' onClick={this.handleSubmit}>
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Already have an account? <NavLink to='/login'>Login</NavLink>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }

  render() {
    return (
      <div>
        <HeaderBar active="register" />
        {this.RegisterForm()}
      </div>
    );
  }
}

export default Register;
