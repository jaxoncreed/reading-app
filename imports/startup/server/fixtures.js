import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import AssignmentSet from '../../api/AssignmentSet';
import Book from '../../api/Book';
import BookMeta from '../../api/BookMeta';
import BookStat from '../../api/BookStat';
import fs from 'fs';

if (!Meteor.isProduction) {
  const users = [
    {
      email: 'frizzle@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Valerie',
        last: 'Frizzle',
        username: 'friz',
        role: {
          type: 'teacher',
          students: ['arnold', 'carlos', 'dorthyann', 'keesha', 'phoebe', 'ralphie', 'tim', 'wanda'],
        },
      },
    },
    {
      email: 'li@newspaper.com',
      password: 'password',
      profile: {
        first: 'Mrs.',
        last: 'Li',
        username: 'li',
        role: {
          type: 'parent',
          children: ['wanda'],
        },
      },
    },
    {
      email: 'perlstein@place.com',
      password: 'password',
      profile: {
        first: 'Mr.',
        last: 'Perlstein',
        username: 'perlstein',
        role: {
          type: 'parent',
          children: ['arnold'],
        },
      },
    },
    {
      email: 'arnold@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Arnold',
        last: 'Perlstein',
        username: 'arnold',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: [],
        },
      },
    },
    {
      email: 'carlos@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Carlos',
        last: 'Ramon',
        username: 'carlos',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: [],
        },
      },
    },
    {
      email: 'dorthy@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Dorthy',
        last: 'Ann',
        username: 'dorthyann',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: [],
        },
      },
    },
    {
      email: 'keesha@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Keesha',
        last: 'Franklin',
        username: 'keesha',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: [],
        },
      },
    },
    {
      email: 'phoebe@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Phoebe',
        last: 'Terese',
        username: 'phoebe',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: [],
        },
      },
    },
    {
      email: 'ralphie@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Ralphie',
        last: 'Tennelli',
        username: 'ralphie',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: [],
        },
      },
    },
    {
      email: 'tim@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Tim',
        last: 'NoLastName',
        username: 'tim',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: [],
        },
      },
    },
    {
      email: 'wanda@walkerville.edu',
      password: 'password',
      profile: {
        first: 'Wanda',
        last: 'Li',
        username: 'wanda',
        role: {
          type: 'student',
          teachers: ['friz'],
          parents: ['li'],
        },
      },
    },
  ];

  users.forEach(({ email, password, profile }) => {
    const userExists = Meteor.users.findOne({ 'emails.address': email });

    if (!userExists) {
      Accounts.createUser({ email, password, profile });
    }
  });

  const students = ['arnold', 'carlos', 'dorthyann', 'keesha', 'phoebe', 'ralphie', 'tim', 'wanda'];

  const assignmentSets = students.map((studentName) => {
    const assignments = [
      {
        recommender: 'friz',
        recommenderRole: 'teacher',
        book: '16',
      },
      {
        recommender: 'friz',
        recommenderRole: 'teacher',
        book: '55',
      },
      {
        recommender: 'friz',
        recommenderRole: 'teacher',
        book: '74',
      },
    ];
    if (studentName === 'wanda') {
      assignments.push({
        recommender: 'li',
        recommenderRole: 'parent',
        book: '76',
      });
    }
    if (studentName === 'arnold') {
      assignments.push({
        recommender: 'perlstein',
        recommenderRole: 'parent',
        book: '147',
      });
    }
    return {
      username: studentName,
      assignments,
    };
  });


  assignmentSets.forEach((assignmentSet) => {
    const assignmentSetExists = AssignmentSet.findOne({ username: assignmentSet.username });

    if (!assignmentSetExists) {
      AssignmentSet.insert(assignmentSet);
    }
  });


  // Initialize books
  const doesBookExist = Book.findOne();

  if (!doesBookExist) {
    const books = require('./JSONData.json');
    books.forEach((book) => {
      const { body, ...withoutBody } = book;
      Book.insert(book);
      BookMeta.insert(withoutBody);
    });
  }
}
