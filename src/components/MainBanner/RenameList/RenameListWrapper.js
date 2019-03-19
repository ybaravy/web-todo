import React, { Component } from 'react';
import PropTypes from 'react-proptypes';
import { getActiveTodoList } from '../../../helpers';
import RenameListView from './RenameListView';

export default class RenameListWrapper extends Component {
  constructor(props) {
    super(props);
    const { todoTitle } = props;
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeListTitle = this.handleChangeListTitle.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this.state = {
      newListTitle: todoTitle,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleChangeInput({ target: { value } }) {
    this.setState({ newListTitle: value });
  }

  handleChangeListTitle(todoId, title) {
    const { handleChangeTitle } = this.props;
    handleChangeTitle(todoId, title);
  }

  handleInputKeyPress({ key }) {
    const { categories, activateRename } = this.props;
    const { id: todoListId } = getActiveTodoList(categories);
    const { newListTitle } = this.state;
    if (key === 'Enter') {
      activateRename(false);
      this.handleChangeListTitle(todoListId, newListTitle);
    }
  }

  handleClick({ target }) {
    const { categories, activateRename } = this.props;
    const { title, id: todoListId } = getActiveTodoList(categories);
    const { newListTitle } = this.state;
    if (
      this.renameList
      && !this.renameList.contains(target)
    ) {
      activateRename(false);
      this.handleChangeListTitle(todoListId, newListTitle || title);
    }
  }

  render() {
    const { categories, activateIconsMenu, shouldRenameList } = this.props;
    const { title, iconSource } = getActiveTodoList(categories);
    const { newListTitle } = this.state;

    return (
      <RenameListView
        renameRef={(node) => { this.renameList = node; }}
        title={title}
        shouldRenameList={shouldRenameList}
        iconSource={iconSource}
        activateIconsMenu={activateIconsMenu}
        handleChangeInput={this.handleChangeInput}
        handleInputKeyPress={this.handleInputKeyPress}
        newListTitle={newListTitle}
      />
    );
  }
}

RenameListWrapper.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  todoTitle: PropTypes.string,
  activateRename: PropTypes.func,
  shouldRenameList: PropTypes.bool,
  activateIconsMenu: PropTypes.func,
  handleChangeTitle: PropTypes.func,
};

RenameListWrapper.defaultProps = {
  categories: [],
  todoTitle: '',
  activateRename: () => {},
  shouldRenameList: false,
  activateIconsMenu: () => {},
  handleChangeTitle: () => {},
};
