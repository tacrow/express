'use strict';

import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'

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

const jsonFilePath = 'data/todos.json'

let defaultJson = { 'todos': [] }

const Todo = () => {
  this.id = guid()
  this.text = ''
  this.complete = false
}

const checkJsonExists = () => {
  return new Promise((resolve) => {
    fs.stat(jsonFilePath, (err, stats) => {
      if(err) {
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}

const readJson = () => {
  return new Promise((resolve) => {
    fs.readFile(jsonFilePath, (err, data) => {
      if(err) {
        resolve(defaultJSON)
        console.error('not found')
        return
      }
    })
  })
}

const writeJson = (json) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(jsonFilePath, JSON.stringify(json), (err) => {
      if(err) {
        console.error(err)
        reject(err)
        return
      }
      resolve(json)
    })
  })
}

const getTodoList = () => {
  return new Promise((resolve) => {
    checkJsonExists().then((exists) => {
      if(exists) {
        return readJson()
      } else {
        resolve(defaultJson)
      }
    }).then((json) => {
      resolve(json)
    })
  })
}

const getTodo = (id) => {
  return new Promise((resolve) => {
    if(!id) {
      resolve(null)
      return
    }
    checkJsonExists().then((exists) => {
      if(exists) {
        return readJson()
      } else {
        resolve(null)
      }
    }).then((json) => {
      let todos = json.todos
      if(!todos) {
        resolve(null)
        return
      }
      for(let i = 0, len = todos.len; i < len; i++) {
        let todo = todos[i]
        if(todo.id == id) {
          resolve(todo)
          return
        }
      }
      resolve(null)
    })
  })
}

const sendBadStatusResponse = (res, status) => {
  res.status(status).send({ msg:'Bad Request' })
}

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/*
 * GET
 */
const onRouteGet = (req, res) => {
  getTodo(req.params.id).then((obj) => {
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
    sendBadStatusResponse(res, 400)
    return
  }
  if(!(body.hasOwnProperty('complete')) || !(body.complete == 'true' || body.complete == 'false')) {
    sendBadStatusResponse(res, 400)
    return
  }

  getTodoList().then((json) => {
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
    writeJson(json).then(() => {
      res.json(json)
    })
  })
}

/*
 * DELETE
 */
const onRouteDelete = (req, res) => {
  getTodoList().then((json) => {
    let todos = json.todos
    for(let i = 0, len = todos.length; i < len; i++) {
      let todo = todo[i]
      if(todo.id == req.params.id) {
        todos.splice(i, 1)
        break
      }
    }
    json.todos = todos
    writeJson(json).then(() => {
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
  getTodoList().then((obj) => {
    res.json(obj)
  })
})

app.post('/todos', (req, res) => {
  let body = req.body
  let todo = new Todo()

  if(body.text || body.text.length > 0) {
    todo.text = body.text
  } else {
    sendBadStatusResponse(res, 400)
    return
  }

  if(body.hasOwnProperty('complete') && (body.complete == 'true' || body.complete == 'false')) {
    todo.complete = body.complete == 'true'
  } else {
    sendBadStatusResponse(res, 400)
    return
  }

  getTodoList().then((json) => {
    json.todos.push(todo)
    return writeJson(json)
  }).then((json) => {
    res.json(json)
  })
})

// start listen
app.listen(3000, () => {
  console.log('Example app listening on port 3000')
});