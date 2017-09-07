'use strict';

import React from 'react'
import {connect} from 'react-redux'

// actions
import actions from '../actions.js'

// component
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx';
import Loading from './Loading.jsx'

class Todo extends React.Component {
  constructor(props) {
    super(props)
    this.handleNewTodo = this.handleNewTodo.bind(this)
    this.handleInputForm = this.handleInputForm.bind(this)
  }

  handleNewTodo(todo) {
    this.props.dispatch(actions.addTodo(todo))
  }

  handleInputForm(value) {
    this.props.dispatch(actions.textExists(value));
  }

  componentDidMount() {
    this.props.dispatch(actions.loadTodos())
  }

  render() {
    return(
      <div>
        <h2>Todo List</h2>
        <TodoForm
          addTodo={this.handleNewTodo}
          handleKeyup={this.handleInputForm}
          objects={this.props.todos}
          isText={this.props.isText}
        />
        {this.props.isLoading ? <Loading /> : null}
        <TodoList todos={ this.props.todos } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { todos, isLoading, isText } = state
  return {
    todos,
    isLoading,
    isText,
  }
}

export default connect(mapStateToProps)(Todo)
