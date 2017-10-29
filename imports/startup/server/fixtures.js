import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import AssignmentSet from '../../api/AssignmentSet';

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
      email: 'li@newspaper.edu',
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
        bookstat: 'theFrizsBook',
        book: 'theFrizsBook',
      },
    ];
    if (studentName === 'wanda') {
      assignments.push({
        recomender: 'li',
        recommenderRole: 'parent',
        bookstat: 'lisBook',
        book: 'lisBook',
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
}
