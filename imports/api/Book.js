import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const Book = new Mongo.Collection('book');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('bookMetaData', (bookIds) => {
    check(bookIds, Array);
    return Book.find({ _id: { $in: bookIds } }, { body: 0 });
  });

  Meteor.publish('bookBody', (bookId) => {
    check(bookId, String);
    return Book.find({ _id: bookId }, { body: 1 });
  });
}

export default Book;
