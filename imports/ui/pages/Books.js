import React from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import AssignmentSet from '../../api/AssignmentSet';
import Book from '../../api/BookMeta';
import {Panel} from 'react-bootstrap';
import { Link } from 'react-router';

const Books = ({ assignmentSet, bookMetaData, role }) => {
  const recommenderMap = {};

  assignmentSet.forEach((assignmentPairing) => {
    const student = assignmentPairing.username;
    assignmentPairing.assignments.forEach((assignment) => {
      if (recommenderMap[assignment.recommender]) {
        if (recommenderMap[assignment.recommender].assignments[assignment.book]) {
          recommenderMap[assignment.recommender]
              .assignments[assignment.book].students.push(student);
        } else {
          recommenderMap[assignment.recommender].assignments[assignment.book] = {
            book: assignment.book,
            students: [student],
          }
        }
      } else {
        recommenderMap[assignment.recommender] = {
          recommender: assignment.recommender,
          assignments: {
            [assignment.book]: {
              book: assignment.book,
              students: [student],
            },
          },
        };
      }
    });
  });

  return (
    <div className="Books">
      {Object.values(recommenderMap).map((recommenderAssignmentPair) => (
        <div>
          <h4 className="page-header">Books assigned by {recommenderAssignmentPair.recommender}</h4>
          {Object.values(recommenderAssignmentPair.assignments).map((assignment) => {
            return (
              <Link to={'/read/' + assignment.book}>
                <Panel>
                  <h5>{bookMetaData[assignment.book].title}</h5>
                  <p>{bookMetaData[assignment.book].author[0]}</p>
                  {role === 'teacher' && <p>Students Assigned: {assignment.students.join(', ')}</p>}
                  {role === 'parent' && <p>Children Assigned: {assignment.students.join(', ')}</p>}
                </Panel>
              </Link>
            );
          })}
        </div>
      ))}
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


    const subscription = Meteor.subscribe('assignmentset', assignmentUsernames);

    if (subscription.ready()) {
      const assignmentSet = AssignmentSet.find().fetch();

      const bookIds = new Set();
      assignmentSet.forEach((assignmentPair) => {
        assignmentPair.assignments.forEach((assignment) => {
          bookIds.add(assignment.book);
        });
      });

      const bookSubscription = Meteor.subscribe('bookMetaData', Array.from(bookIds));
      if (bookSubscription.ready()) {
        const bookMap = {};
        Book.find({}, { body: 0 }).fetch().forEach(book => bookMap[book._id] = book);
        console.log(bookMap);
        onData(null, { assignmentSet, bookMetaData: bookMap, role: user.profile.role.type });
      }
    }
  }
}, Books);
