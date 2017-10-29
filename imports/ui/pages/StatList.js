import { Button, ButtonToolbar, Panel } from 'react-bootstrap';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryTheme } from 'victory';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import BookStat from '../../api/BookStat';
import Book from '../../api/Book';



class StatList extends Component {
  constructor(props) {
    super(props);
    this.state = { sort: 'username' };
  }

  render() {
    const bookData = (this.props.bookStats) ? this.props.bookStats.sort((a, b) => a[this.state.sort] > b[this.state.sort] ? 1 : -1) : [];

    console.log(bookData);
    return (
      <div className="StatList">
        <h4 className="page-header">Your Student's Readings</h4>
        <ButtonToolbar>
          <Button bsStyle={this.state.sort === 'username' ? 'primary' : 'default'}
              onClick={() => this.setState({ sort: 'username' })}>
            Sort by Student
          </Button>
          <Button bsStyle={this.state.sort === 'book' ? 'primary' : 'default'}
              onClick={() => this.setState({ sort: 'book' })}>
            Sort by Book
          </Button>
        </ButtonToolbar>
        {bookData.map((data) => (
          <Panel>
            <h5>{data.username}'s progress on {this.props.bookMetaData[data.book].title}</h5>
            <VictoryChart
              theme={VictoryTheme.material}
              animate={{ duration: 1000 }}
              width={1080}
              height={720}
            >
              <VictoryAxis
                tickFormat={(t) => {
                  const date = new Date(0);
                  date.setUTCSeconds(t);
                  return (date.getMonth() + 1) + '/' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes();
                }} />
              <VictoryAxis dependentAxis
                tickFormat={(t) => t + '%'} />
              <VictoryArea
                data={data.readingSessions.map(readingData => ({
                  x: parseFloat(readingData.timestamp),
                  y: parseFloat(readingData.percent),
                }))}
                interpolation={"basis"}
              />
            </VictoryChart>
          </Panel>
        ))}

      </div>
    );
  }
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


    const subscription = Meteor.subscribe('bookStatReport', assignmentUsernames);

    if (subscription.ready()) {
      const bookStats = BookStat.find().fetch();

      const bookIds = new Set();
      bookStats.forEach((bookStat) => {
        bookIds.add(bookStat.book);
      });

      const bookSubscription = Meteor.subscribe('bookMetaData', Array.from(bookIds));
      if (bookSubscription.ready()) {
        const bookMap = {};
        Book.find().fetch().forEach((book) => bookMap[book._id] = book);
        onData(null, { bookStats, bookMetaData: bookMap });
      }
    }
  }
}, StatList);
