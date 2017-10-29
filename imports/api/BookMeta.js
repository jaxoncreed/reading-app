import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const BookMeta = new Mongo.Collection('book_meta');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('bookMetaData', (bookIds) => {
    check(bookIds, Array);
    return BookMeta.find({ _id: { $in: bookIds } });
  });

  Meteor.publish('allBooks', () => {
    return BookMeta.find({});
  });
}

export default BookMeta;
