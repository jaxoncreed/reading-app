import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const AssignmentSet = new Mongo.Collection('assignment_set');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('assignmentset', (assignmentUsernames) => {
    check(assignmentUsernames, Array);
    return AssignmentSet.find({ username: { $in: assignmentUsernames } });
  });
}

export default AssignmentSet;
