import React from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import BookStat from '../../api/BookStat';

const Books = ({ bookStats }) => {
  return (
    <div className="Books">
      <h4 className="page-header">Books</h4>
      <pre>{JSON.stringify(bookStats, null, 2)}</pre>
    </div>
  );
};

export default container((props, onData) => {
  const user = Meteor.user();
  if (user) {
    let assignmentUsernames;
    switch (user.profile.role.type) {
      case 'teacher':
        assignmentUsernames = user.profile.role.students;
        break;
      case 'parent':
        assignmentUsernames = user.profile.role.children;
        break;
      default:
        assignmentUsernames = [ user.profile.username ];
    }


    const subscription = Meteor.subscribe('bookStatReport', assignmentUsernames);

    if (subscription.ready()) {
      const bookStats = BookStat.find().fetch();
      onData(null, { bookStats });
    }
  }
}, Books);
