import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import Book from '../../api/Book';
import BookStat from '../../api/BookStat';

import throttle from 'lodash.throttle';

class Read extends Component {

  componentDidMount() {
    this.throttle = throttle(() => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
      if (!this.props.follow || this.props.follow === 'self') {
        Meteor.call('endSession', this.props.bookStat, percent);
      }
    }, 10);
    window.addEventListener('scroll', this.throttle);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.follow);
    if ((!this.props.bookStat && nextProps.bookStat) || (nextProps.follow && nextProps.follow !== 'self')) {
      // Meteor.call('startSession', nextProps.bookStat);


      const bookStat = nextProps.bookStat;
      let beginPercent = 0;
      if (bookStat.readingSessions[bookStat.readingSessions.length - 1]) {
        beginPercent = bookStat.readingSessions[bookStat.readingSessions.length - 1].percent;
      }

      console.log(beginPercent);

      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      h[st] = b[st] = (beginPercent / 100) * ((h[sh]||b[sh]) - h.clientHeight);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttle);
  }


  render() {
    return (
      <div className="Books">
        <h4 className="page-header">{this.props.book.title}</h4>
        <pre>{this.props.book.body.body}</pre>
      </div>
    );
  }
}

export default container((props, onData) => {

  const follow = (props.location.query && props.location.query.follow) ? props.location.query.follow : 'self';

  const subscription = Meteor.subscribe('bookBody', props.params.bookId);
  if (subscription.ready()) {
    const book = Book.findOne({ _id: props.params.bookId });

    const user = Meteor.user();
    if (user) {
      let bookStatSubscription;
      if (follow === 'self') {
        bookStatSubscription = Meteor.subscribe('bookStat', user.profile.username, props.params.bookId);
      } else {
        bookStatSubscription = Meteor.subscribe('bookStat', follow, props.params.bookId);
      }

      if (bookStatSubscription) {
        let bookStat;
        if (follow === 'self') {
          bookStat = BookStat.findOne({ username: user.profile.username, book: props.params.bookId });
        } else {
          bookStat = BookStat.findOne({ username: follow, book: props.params.bookId })
        }
        onData(null, {
          book,
          bookStat,
          username: user.profile.username,
          follow,
          percent: (bookStat && bookStat.readingSessions[bookStat.readingSessions.length - 1]) ? bookStat.readingSessions[bookStat.readingSessions.length - 1].percent : 0,
        });
      }
    }
  }
}, Read);
