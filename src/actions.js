'use strict';

import $ from 'jquery'

const url = 'http://localhost:3001/todos'

module.exports = {
  loadTodos,
  addTodo,
  textExists,
}

/*
 * Todo Loading
 */
function loadTodos() {
  return (dispatch) => {
    dispatch(toggleLoading(true))

    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
    }).done((res) => {
      setTimeout(() => {
        dispatch(todoLoaded(res.todos))
        dispatch(toggleLoading(false))
      }, 2000)
    }).fail((xhr, status, err) => {
      dispatch(toggleLoading(false))
      console.log(url, status, err.toString())
    })
  }
}

function todoLoaded(todos) {
  return {
    type: 'TODO_LOADED',
    data: todos
  }
}

function toggleLoading(isLoading) {
  return {
    type: 'TOGGLE_LOADING',
    data: isLoading
  }
}

/*
 * Add Todo
 */
function addTodo(newTodo) {
  return (dispatch) => {
    dispatch(toggleLoading(true));

    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: {
        text: newTodo,
        complete: false
      },
    }).done((res) => {
      dispatch(newAddTodo(res.id, res.text))
      dispatch(toggleLoading(false))
    }).fail((xhr, status, err) => {
      dispatch(toggleLoading(false))
      console.log(url, status, err.toString())
    })
  }
}

function newAddTodo(id, text) {
  return {
    type: 'ADD_TODO',
    data: {id, text, complete}
  }
}

function textExists(value) {
  return {
    type: 'TEXT_EXISTS',
    data: value
  }
}
