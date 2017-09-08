'use strict';

import fs from 'fs'

const jsonFilePath = 'data/todos.json'

let defaultJson = { 'todos': [] }

module.exports = {
  guid,
  writeJson,
  getTodoList,
  getTodo,
  sendBadStatusResponse
}

/*
 * checkJsonExists
 */
function checkJsonExists() {
  return new Promise(resolve => {
    fs.stat(jsonFilePath, (err, stats) => {
      if(err) {
        resolve(false)
        return
      }
      resolve(true)
    })
  })
}

/*
 * readJson
 */
function readJson() {
  return new Promise(resolve => {
    fs.readFile(jsonFilePath, (err, data) => {
      if(err) {
        resolve(defaultJSON)
        console.error('not found')
        return
      }
    })
  })
}

/*
 * guid:common
 */
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/*
 * writeJson:common
 */
function writeJson(json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(jsonFilePath, JSON.stringify(json), err => {
      if(err) {
        console.error(err)
        reject(err)
        return
      }
      resolve(json)
    })
  })
}

/*
 * getTodoList:common
 */
function getTodoList() {
  return new Promise(resolve => {
    checkJsonExists().then(exists => {
      if(exists) {
        return readJson()
      } else {
        resolve(defaultJson)
      }
    }).then(json => {
      resolve(json)
    })
  })
}

/*
 * getTodo:common
 */
function getTodo(id) {
  return new Promise(resolve => {
    if(!id) {
      resolve(null)
      return
    }
    checkJsonExists().then(exists => {
      if(exists) {
        return readJson()
      } else {
        resolve(null)
      }
    }).then(json => {
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

/*
 * sendBadStatusResponse:common
 */
function sendBadStatusResponse(res, status) {
  res.status(status).send({ msg:'Bad Request' })
}
