'use strict';

import React from 'react'
import {render} from 'react-dom'

// component
import Counter from './components/Counter'

class App extends React.Component {
  render() {
    return(
      <div>
        <Counter />
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));