import React from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import AssignmentSet from '../../api/AssignmentSet';
import Book from '../../api/Book';

const Books = ({ assignmentSet, bookMetaData }) => {
  const recommenderMap = {};

  assignmentSet.forEach((assignmentPairing) => {
    const student = assignmentPairing.username;
    assignmentPairing.assignments.forEach((assignment) => {
      if (recommenderMap[assignment.recommender]) {
        if (recommenderMap[assignment.recommender].assignments[assignment.book]) {
          recommenderMap[assignment.recommender]
              .assignments[assignment.book].students.push(student);
        } else {
          recommenderMap[assignment.recommender].assignment[assignment.book] = {
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
      <h4 className="page-header">Books</h4>
      {Object.values(recommenderMap).map((recommenderAssignmentPair) => (
        <div>
          <h1>{recommenderAssignmentPair.recommender}</h1>
          {Object.values(recommenderAssignmentPair.assignments).map((assignment) => {
            return (<p>{assignment.book} {assignment.students.join(', ')} {bookMetaData[assignment.book].title}</p>);
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
        Book.find().fetch().forEach(book => bookMap[book._id] = book);
        onData(null, { assignmentSet, bookMetaData: bookMap });
      }
    }
  }
}, Books);
