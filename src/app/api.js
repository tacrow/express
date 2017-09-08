'use strict';

import express from 'express'
import bodyParser from 'body-parser'
import modules from './modules.js'

// init express
const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  next()
})

/*
 * Todo
 */
function Todo() {
  this.id = modules.guid()
  this.text = ''
  this.complete = false
}

/*
 * GET
 */
const onRouteGet = (req, res) => {
  getTodo(req.params.id).then(obj => {
    let result = obj
    if(result == null) {
      result = {}
    }
    res.json(result)
  })
}

/*
 * PUT
 */
const onRoutePut = (req, res) => {
  let body = req.body

  if(!body.text || body.text.length <= 0) {
    modules.sendBadStatusResponse(res, 400)
    return
  }
  if(!(body.hasOwnProperty('complete')) || !(body.complete == 'true' || body.complete == 'false')) {
    modules.sendBadStatusResponse(res, 400)
    return
  }

  modules.getTodoList().then(json => {
    let todos = json.todos
    for(let i = 0, len = todos.length; i < len; i++) {
      let todo = todo[i]
      if(todo.id == req.params.id) {
        todo.text = body.text()
        todo.complete = body.complete == 'true'
      }
      todos[i] = todo
    }
    json.todos = todos
    modules.writeJson(json).then(() => {
      res.json(json)
    })
  })
}

/*
 * DELETE
 */
const onRouteDelete = (req, res) => {
  modules.getTodoList().then(json => {
    let todos = json.todos
    for(let i = 0, len = todos.length; i < len; i++) {
      let todo = todo[i]
      if(todo.id == req.params.id) {
        todos.splice(i, 1)
        break
      }
    }
    json.todos = todos
    modules.writeJson(json).then(() => {
      res.json(json)
    })
  })
}

/*
 * routing
 */
app.route('/todos/:id')
  .get((req, res) => {
    onRouteGet(req, res)
  })
  .put((req, res) => {
    onRoutePut(req, res)
  })
  .delete((req, res) => {
    onRouteDelete(req, res)
  })

app.get('/todos', (req, res) => {
  modules.getTodoList().then(obj => {
    res.json(obj)
  })
})

app.post('/todos', (req, res) => {
  let body = req.body
  let todo = new Todo()

  if(body.text || body.text.length > 0) {
    todo.text = body.text
  } else {
    modules.sendBadStatusResponse(res, 400)
    return
  }

  if(body.hasOwnProperty('complete') && (body.complete == 'true' || body.complete == 'false')) {
    todo.complete = body.complete == 'true'
  } else {
    modules.sendBadStatusResponse(res, 400)
    return
  }

  modules.getTodoList().then(json => {
    json.todos.push(todo)
    return modules.writeJson(json)
  }).then((json) => {
    res.json(json)
  })
})

// start listen
app.listen(3001, () => {
  console.log('Example app listening on port 3001')
});