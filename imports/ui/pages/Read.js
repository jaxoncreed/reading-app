import React from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import Book from '../../api/Book';

const Read = ({ book }) => {
  return (
    <div className="Books">
      <h4 className="page-header">{book.title}</h4>
      <pre>{book.body.body}</pre>
    </div>
  );

  // return (
  //   <div className="Books">
  //     <h4 className="page-header">Books</h4>
  //     {Object.values(recommenderMap).map((recommenderAssignmentPair) => {
  //       return (

  //       );
  //     })}
  //   </div>
  // );
};

export default container((props, onData) => {

  const subscription = Meteor.subscribe('bookBody', props.params.bookId);

  if (subscription.ready()) {
    const book = Book.findOne({ _id: props.params.bookId });
    console.log(book);
    onData(null, { book });
  }
}, Read);
