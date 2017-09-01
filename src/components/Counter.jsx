import React from 'react'

export default class Counter extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0
    }
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={e => this.increment()}>Increment</button>
      </div>
    )
  }

  increment() {
    this.setState({
      count: this.state.count + 1
    })
  }
}