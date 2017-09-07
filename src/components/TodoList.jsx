'use strict';

import React from 'react'

export default class TodoList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let list = [];

    let data = this.props.todos;

    for(let i in data) {
      list.push(<li key={ data[i].id }>{ data[i].name }</li>)
    }

    return (
      <ul>
        {list}
      </ul>
    );
  }
}
