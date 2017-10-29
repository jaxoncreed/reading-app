import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const BookStat = new Mongo.Collection('book_stat');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('bookStat', (username, book) => {
    check(username, String);
    check(book, String);
    const bookStat = BookStat.find({ username, book });
    if (bookStat) {
      return bookStat;
    }
    const toInsert = {
      username,
      book,
      readingSessions: [],
    };
    BookStat.insert(toInsert);
    return BookStat.find({ username, book });
  });
}

Meteor.methods({
  startSession: (bookStat) => {
    check(bookStat, Object);
    let beginPercent = 0;
    if (bookStat.readingSessions[bookStat.readingSessions.length - 1] &&
          bookStat.readingSessions[bookStat.readingSessions.length - 1].endPercent) {
      beginPercent = bookStat.readingSessions[bookStat.readingSessions.length - 1].endPercent;
    }
    BookStat.update({ _id: bookStat._id },
        { $push: { readingSessions: { begin: Date.now(), beginPercent } } });
  },

  endSession: (bookStat, endPercent) => {
    check(bookStat, Object);
    check(endPercent, Number);
    BookStat.update({ _id: bookStat._id }, {
      $set: {
        ['readingSessions.' + (bookStat.readingSessions.length - 1) + '.end']: Date.now(),
        ['readingSessions.' + (bookStat.readingSessions.length - 1) + '.endPercent']: endPercent,
      },
    });
  },
});

export default BookStat;
