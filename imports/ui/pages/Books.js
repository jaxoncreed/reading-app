import React from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import AssignmentSet from '../../api/AssignmentSet';

const Books = ({ assignmentSet }) => {

  // [
  //   {
  //     recommender: "frizzle",
  //     assignments: [
  //       {
  //         book: "skdjfkdlsfj",
  //         students: [blah]
  //       }
  //     ]
  //   }
  // ]

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
  console.log(JSON.stringify(recommenderMap, null, 2));

  return (
    <div className="Books">
      <h4 className="page-header">Books</h4>
      {Object.values(recommenderMap).map((recommenderAssignmentPair) => (
        <div>
          <h1>{recommenderAssignmentPair.recommender}</h1>
          {Object.values(recommenderAssignmentPair.assignments).map((assignment) => {
            return (<p>{assignment.book} {assignment.students.join(', ')}</p>);
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
      onData(null, { assignmentSet });
    }
  }
}, Books);
