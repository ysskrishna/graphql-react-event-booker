import React, { Component } from 'react';
import HeaderBar from '../../components/HeaderBar';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';
import { baseUrl } from '../../config/common';
import AuthContext from '../../context';

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  static contextType = AuthContext;

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
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
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
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });

  };

  LoginForm = () => {
    return(
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Login to your account
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
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <NavLink to='/register'>Register</NavLink>
        </Message>
      </Grid.Column>
    </Grid>
    );
  }

  render() {
    return (
      <div>
        <HeaderBar active="login" />
        {this.LoginForm()}
      </div>
    );
  }
}

export default Login;
