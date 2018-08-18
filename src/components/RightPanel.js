import React, { Component } from 'react';
import PropTypes from 'react-proptypes';
import { getActiveTodoList } from "../helpers";
import BannerForTodo from './BannerForTodo.js';
import ToDoListOfTask from './ToDoListOfTask.js';
import Panel from './Panel';
import TaskSettings from './TaskSettings';
import SearchPanel from './SearchPanel';
import GreetingsPanel from "./GreetingsPanel";

export default class RightPanel extends Component {
  constructor(props) {
    super(props);
    this.activateGreetingPanel = this.activateGreetingPanel.bind(this);
    this.rightPanelState = {
      activateGreetingsPanel: false
    }
  };

  componentDidMount(){
    let { store } = this.context;
    store.subscribe(() => {
      this.forceUpdate();
    })
  };

  activateGreetingPanel() {
    this.setState(() => {
      return this.rightPanelState = {
        activateGreetingsPanel: !this.rightPanelState.activateGreetingsPanel
      }
    })
  }

  render() {
    const { store } = this.context;
    const state = store.getState();
    const { app: { todos, tasks }, search: { activateSearch } } = state;
    const activeTodo = getActiveTodoList(todos);
    const { deleteTask, deleteTodo, deleteStep } = this.props;
    let { activateGreetingsPanel } = this.rightPanelState;
    const activeTask = tasks.length !== 0 ? (tasks.find(task => task.active === true) || '') : '';

    return (
      <Panel className="col-md-8 rightPanel">
        <div>
          {
            activateSearch &&
            <SearchPanel />
          }
          {
            activateGreetingsPanel &&
            <GreetingsPanel
              activateGreetings={this.activateGreetingPanel}
            />
          }
          <BannerForTodo
            className="panelBanner"
            close={state.activateThemeMenu}
            deleteList={deleteTodo}
            activateGreetings={this.activateGreetingPanel}
          />
          <ToDoListOfTask activeTodo={activeTodo}/>
        </div>
        {
          activeTask &&
          <TaskSettings
            handleDeleteTask={deleteTask}
            handleDeleteStep={deleteStep}
            activeTask={activeTask}
          />
        }
      </Panel>
    )
  }
};

RightPanel.contextTypes = {
  store: PropTypes.object,
};