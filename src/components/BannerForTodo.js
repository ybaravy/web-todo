import React, {Component} from 'react';
import PropTypes from 'react-proptypes';
import RenameList from './RenameList';
import { getActiveTodoList } from '../helpers';
import IconsMenu from "./IconsMenu";
import SortPopUp from "./SortPopUp";
import BannerModalSettings from "./BannerModalSettings";

export default class BannerForTodo extends Component {
  constructor(props) {
    super(props);
    this.activateModalSettings = this.activateModalSettings.bind(this);
    this.bannerState = {
      sortCriteria: '',
      shouldRenameList: false,
      shouldChangeIcon: false,
      showModal: false
    }
  };

  componentDidMount(){
    const { store } = this.context;
    store.subscribe(() => {
      this.forceUpdate();
    });
  };

  activateModalSettings() {
    this.setState(() => {
      return this.bannerState = {
        ...this.bannerState,
        showModal: !this.bannerState.showModal
      }
    })
  }

  render(){
    const { store } = this.context;
    const state = store.getState();
    const { app: { todos }} = state;
    const { activeTask, deleteList, activateGreetings } = this.props;
    const activeTodo = getActiveTodoList(todos);
    let { todoListId: todoId, iconSource: todoIconSrc, bgImage, bgColor } = activeTodo;
    let {
      sortCriteria,
      shouldRenameList,
      shouldChangeIcon,
      showModal
    } = this.bannerState;
    const colorScheme = {
      "orange": "rgba(249, 148, 7, 0.45)",
      "green": "rgba(0, 158, 34, 0.45)",
      "red": "rgba(255, 0, 0, 0.45)",
      "blue": "rgba(0, 0, 255, 0.45)",
      "blueviolet": "rgba(204, 7, 249, 0.45)"
    }

    const activateRename = (bool) => {
      this.setState(() => {
        return this.bannerState = {
          ...this.bannerState,
          shouldRenameList: bool
        }
      })
    };

    const activateIcon = (bool) => {
      this.setState(() => {
        return this.bannerState = {
          ...this.bannerState,
          shouldChangeIcon: bool
        }
      })
    };

    const checkActiveTodoTitle = (todo) => {
      return (
        todo.title !== 'My Day' &&
        todo.title !== 'Important' &&
        todo.title !== 'To-Do'
      )
    };

    const setBannerSortCriteria = (sortCriteria) => {
      this.setState(() => {
        return this.bannerState = {
          ...this.bannerState,
          sortCriteria
        }
      });
    };

    const setMyDayTime = () => {
      let today = new Date();
      return (today.toLocaleString('en-us', {weekday: 'long'}) + ', ' +
        today.toLocaleString('en-us', {month: 'long'}) + ' ' +
        today.toLocaleString('en-us', {day: 'numeric'}))
    };

    return (
      <div
        className={"panelBanner " + (activeTask ? 'responsive ' : '') + (!!sortCriteria ? 'with-sort' : '')}
        style={{ backgroundImage: `url(${bgImage})`}}
      >
        <section
          className="banner-main-section"
          style={{backgroundColor: colorScheme[bgColor]}}
        >
          <div
            className="panelBanner-text"
            onBlur={() => {
              activateRename(false);
            }}
          >
            {
              shouldRenameList && checkActiveTodoTitle(activeTodo) ?
                <RenameList activateRename={(bool) => activateRename(bool)}/> :
                <div>
                  {
                    todoIconSrc &&
                    checkActiveTodoTitle(activeTodo) &&
                    (<button className="change-todo-icon" onClick={() => {
                      activateIcon(true)
                    }}>
                      <img src={todoIconSrc} />
                    </button>)
                  }
                  {
                    todoIconSrc &&
                    shouldChangeIcon &&
                    <IconsMenu
                      activateIcon={(bool) => activateIcon(bool)}
                      activeTodoId={activeTodo.todoListId}
                    />
                  }
                  <h3 onClick={() => activateRename(true)}>{activeTodo.title}</h3>
                </div>
            }
            {
              (todoId === 0) &&
              <div className="date-time">
                { setMyDayTime() }
              </div>
            }
          </div>
          <div>
            {
              (todoId === 0) &&
              <button
                className="open-greeting"
                style={{backgroundColor: bgColor}}
                onClick={() => activateGreetings()}
              >
                <img src='./assets/bulb.svg'/>
              </button>
            }
            <button
              className="btn btn-primary dots-menu"
              style={{backgroundColor: bgColor}}
              onClick={() => this.activateModalSettings()}
            >
              <span>&bull;&bull;&bull;</span>
            </button>
            {
              showModal &&
              <BannerModalSettings
                activeTodo={activeTodo}
                deleteList={deleteList}
                activateRename={(bool) => activateRename(bool)}
                showModal={this.activateModalSettings}
                setSortCriteria={(criteria) => setBannerSortCriteria(criteria)}
              />
            }
          </div>
        </section>
        {
          sortCriteria &&
          <SortPopUp
            sortBy={sortCriteria}
            setSortCriteria={(criteria) => setBannerSortCriteria(criteria)}
          />
        }
      </div>
    )
  }
};

BannerForTodo.contextTypes = {
  store: PropTypes.object
};