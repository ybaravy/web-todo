import React, { Component } from 'react';
import PropTypes from "react-proptypes";
import ButtonToImportance from './ButtonToImportance';
import ChildTaskSettings from './ChildTaskSettings';
import {
  activateTaskSettings,
  toggleTask,
  addTaskToMyDay,
  addNoteToTask
} from '../actionCreators';
import StepInput from "./StepInput";

export default class TaskSettings extends Component {
  constructor(props) {
    super(props);
    const { activeTask } = props;
    this.taskState = {
      showConfirmMessage: false,
      activateStepInput: false,
      toggleStep: false,
      newStepText: '',
      newNoteText: activeTask.note,
      showNoteControls: false
    }
  };

  componentDidMount(){
    let { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    })
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  activateStep = () => {
    this.setState(() => {
      return this.taskState = {
        ...this.taskState,
        activateStepInput: !this.taskState.activateStepInput
      }
    });
  };

  typeNewNote(event) {
    let { activeTask: { note }} = this.props;
    if(event) {
      let { target: { value }} = event;
      this.newNote.value = value || note;
      this.setState(() => {
        return this.taskState = {
          ...this.taskState,
          newNoteText: value,
          showNoteControls: true
        }
      });
      return;
    }
    this.newNote.value = note;
    this.newNote.blur();
    this.setState(() => {
      return this.taskState = {
        ...this.taskState,
        newNoteText: note,
        showNoteControls: false
      }
    });
  };

  saveNoteForTask(taskId) {
    const { store } = this.context;
    let { newNoteText } = this.taskState;
    store.dispatch(addNoteToTask(taskId, newNoteText));
    // this.newNote.value = '';
    this.newNote.blur();
    this.setState(() => {
      return this.taskState = {
        ...this.taskState,
        newNoteText: '',
        showNoteControls: false
      }
    });
  };

  render() {
    const { store } = this.context;
    const { activateStepInput, showNoteControls } = this.taskState;
    const { handleDeleteTask, activeTask } = this.props;
    let { id, done, taskText, createdAt, myDay } = activeTask;

    const closeTaskSettings = (taskId) => {
      this.newNote.blur();
      store.dispatch(activateTaskSettings(taskId, false))
    };

    const setToggledTask = (taskId) => {
      store.dispatch(toggleTask(taskId))
    };

    const addCustomToMyDay = (taskId, bool) => {
      store.dispatch(addTaskToMyDay(taskId, bool))
    };

    return (
      <div className="task-settings">
        <div className="task-settings-title">
          <label
            className={
              "toggleTaskLabel " +
              (done ? "done" : '')
            }
          >
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setToggledTask(id);
            }}
          ></span>
          </label>
          <p>{taskText}</p>
          <ButtonToImportance task={activeTask}/>
        </div>
        {
          activateStepInput ?
            <StepInput
              activateStep={this.activateStep}
              taskId={id}
            /> :
            (<p
              className="activateStepInput"
              onClick={() => this.activateStep()}
            >
              + Add Step
            </p>)
        }
        <div className="task-settings-add-to-my-day">
          <ul>
            <li
              className={"add-to-my-day " + (myDay && "active")}
              onClick={() => {
                addCustomToMyDay(id, true)
              }}>
              <img src="./assets/sun.svg" />
              {
                !myDay && (<p className="need-to-add">Add to My to-do</p>)
              }
              {
                myDay && (<p className="added">Added to My to-do</p>)
              }
              {
                myDay && (
                  <button
                    className="clear-from-my-day"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addCustomToMyDay(id, false)
                    }}
                  >
                    <p>x</p>
                  </button>
                )
              }
            </li>
          </ul>
        </div>
        <ChildTaskSettings activeTask={activeTask}/>
        <div className="task-settings-add-note">
          <textarea
            rows="5"
            cols="30"
            ref={node => this.newNote = node}
            placeholder="Add a note"
            // value={note}
            onChange={(e) => this.typeNewNote(e)}
          ></textarea>
          {
            showNoteControls &&
            (<div className="btn-group">
              <button
                className="btn-default"
                onClick={() => this.typeNewNote(false)}
              >Cancel</button>
              <button
                className="btn-primary"
                onClick={() => this.saveNoteForTask(id)}
              >Save</button>
            </div>)
          }
        </div>
        <div className='task-settings-footer'>
          <button
            className="task-settings-arrow-right"
            onClick={() => closeTaskSettings(id)}>
            <img src="./assets/right.svg" />
          </button>
          <p>{(() => {
            return `Created on ${(new Date(createdAt)).toLocaleString('en-us', {weekday: 'short', month: 'short', day: 'numeric'})}`;
          })()}</p>
          <button
            className="task-settings-trash"
            onClick={() => handleDeleteTask(activeTask)}
          >
            <img src="./assets/garbage.svg" />
          </button>
        </div>
      </div>
    )
  }
};

TaskSettings.contextTypes = {
  store: PropTypes.object,
};