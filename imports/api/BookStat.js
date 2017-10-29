import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const BookStat = new Mongo.Collection('book_stat');

export default BookStat;
