/* eslint-disable max-len */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.js';
import Books from '../../ui/pages/Books.js';
import Read from '../../ui/pages/Read.js';
import StatList from '../../ui/pages/StatList.js';
import StudentStats from '../../ui/pages/StudentStats.js';
import Assignment from '../../ui/pages/Assignment.js';
import Login from '../../ui/pages/Login.js';
import NotFound from '../../ui/pages/NotFound.js';
import RecoverPassword from '../../ui/pages/RecoverPassword.js';
import ResetPassword from '../../ui/pages/ResetPassword.js';
import Signup from '../../ui/pages/Signup.js';

const authenticate = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="books" component={ Books } onEnter={ authenticate } />
        <Route name="read" path="/read/:bookId" component={ Read } onEnter={ authenticate } />
        <Route name="stats" path="/stats" component={ StatList } onEnter={ authenticate } />
        <Route name="stats" path="/stats/:studentId" component={ StudentStats } onEnter={ authenticate } />
        <Route name="assignment" path="/assignment" component={ Assignment } onEnter={ authenticate } />
        <Route name="login" path="/login" component={ Login } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root'),
  );
});
