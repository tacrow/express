'use strict';

import React from 'react'

export default class TodoList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let lists = [];

    let data = this.props.todos;

    for(let i in data) {
      lists.push(<li key={ data[i].id }>{ data[i].text }</li>)
    }

    return (<ul>{lists}</ul>);
  }
}
