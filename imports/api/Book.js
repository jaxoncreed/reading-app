import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const Book = new Mongo.Collection('book');

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('bookBody', (bookId) => {
    check(bookId, String);
    return Book.find({ _id: bookId }, { body: 1 });
  });
}

export default Book;
