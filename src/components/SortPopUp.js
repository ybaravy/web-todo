import React, { Component } from 'react';
import PropTypes from 'react-proptypes';
import { revertTasks } from '../actionCreators';

export default class SortPopUp extends Component {
  constructor(props) {
    super(props);
    this.sortState = {
      reverseTasks: false
    }
  };

  render() {
    const { store } = this.context;
    let { sortBy, setSortCriteria } = this.props;
    let { reverseTasks } = this.sortState;

    const changeSortOrder = () => {
      this.setState(() => {
        return this.sortState = {
          ...this.sortState,
          reverseTasks: !this.sortState.reverseTasks
        }
      });
      store.dispatch(revertTasks());
    };

    const setSortMessage = () => {
      switch(sortBy) {
        case 'ABC':
          return 'Sorted alphabetically';
        case 'DUE_DATE':
          return 'Sorted by due date';
        case 'CREATED_AT':
          return 'Sorted by creation date';
        case 'COMPLETED':
          return 'Sorted by completed';
        case 'ADDED_TO_MY_DAY':
          return 'Sort by default';
        case 'IMPORTANT':
          return 'Sorted bu importance';
        default:
          return 'Sorted by default'
      }
    };

    return(
      <section className="banner-sort">
        <p>{setSortMessage()}</p>
        <button
          className={"change-sort-order " + (reverseTasks ? 'up' : 'down')}
          onClick={() => changeSortOrder()}
        >
          <img src="./assets/right.svg"/>
        </button>
        <button className="clear-banner-sort" onClick={() => setSortCriteria('')}>x</button>
      </section>
    )
  }
};

SortPopUp.contextTypes = {
  store: PropTypes.object
};