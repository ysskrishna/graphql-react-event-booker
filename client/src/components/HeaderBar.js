import React, { Component } from 'react'
import { Menu, Segment, Button, Container } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context';

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: this.props.active }
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <AuthContext.Consumer>
        {(context) => {
          return (
            <Segment basic>
              <Menu
                fixed="top"
                size='massive'
              >
                <Container>
                  <Menu.Item header>Eventbiz</Menu.Item>
                  <NavLink to='/events'>
                    <Menu.Item
                      name='events'
                      active={activeItem === 'events'}
                      onClick={this.handleItemClick}
                    />
                  </NavLink>
                  {context.token &&
                    <NavLink to='/bookings'>
                      <Menu.Item
                        name='bookings'
                        active={activeItem === 'bookings'}
                        onClick={this.handleItemClick}
                      />
                    </NavLink>
                  }

                  <Menu.Menu position='right'>
                    {!context.token &&
                      <NavLink to='/login'>
                        <Menu.Item
                          name='login'
                          active={activeItem === 'login'}
                          onClick={this.handleItemClick}
                        />
                      </NavLink>
                    }

                    {!context.token &&
                      <NavLink to='/register'>
                        <Menu.Item
                          name='register'
                          active={activeItem === 'register'}
                          onClick={this.handleItemClick}
                        />
                      </NavLink>
                    }
                    {context.token &&
                      <Menu.Item
                        name='logout'
                        active={activeItem === 'logout'}
                        onClick={context.logout}
                      />
                    }

                  </Menu.Menu>
                </Container>
              </Menu>
            </Segment>
          )
        }}
      </AuthContext.Consumer>
    )
  }
};

export default HeaderBar;