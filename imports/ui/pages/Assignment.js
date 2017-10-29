import React from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import AssignmentSet from '../../api/AssignmentSet';
import Book from '../../api/BookMeta';
import { Button } from 'react-bootstrap';

const Assignment = ({ books, assignmentUsernames, profile }) => {

  return (
    <div className="Books">
      <h4 className="page-header">Books</h4>
      {books.map((book) => {
        return (
          <Button onClick={() => {
            Meteor.call('addAssignment', assignmentUsernames, book._id, profile);
          }}>Add {book.title} to class</Button>
        )
      })}
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


    const subscription = Meteor.subscribe('allBooks');

    if (subscription.ready()) {
      const books = Book.find({}).fetch();
      console.log(books);
      onData(null, { assignmentUsernames, profile: user.profile, books });
    }
  }
}, Assignment);