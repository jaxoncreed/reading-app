import React from 'react';
import { browserHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const handleLogout = () => Meteor.logout(() => browserHistory.push('/login'));

const getProfile = () => {
  const user = Meteor.user();
  return user && user.profile ? user.profile : '';
};

const AuthenticatedNavigation = () => {
  const profile = getProfile();
  return (
    <div>
      {(profile.role.type === 'teacher' || profile.role.type === 'parent') && (
        <Nav>
          <LinkContainer to="/stats">
            <NavItem eventKey={ 2 } href="/stats">Statistics</NavItem>
          </LinkContainer>
          <LinkContainer to="/assignment">
            <NavItem eventKey={ 2 } href="/assignment">Assignments</NavItem>
          </LinkContainer>
        </Nav>
      )}
      <Nav pullRight>
        <NavDropdown eventKey={ 3 } title={ profile.username } id="basic-nav-dropdown">
          <MenuItem eventKey={ 3.1 } onClick={ handleLogout }>Logout</MenuItem>
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default AuthenticatedNavigation;
