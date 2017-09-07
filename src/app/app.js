'use strict';

import express from 'express'

// init express
const app = express()

// add static push
app.use(express.static('public'))

// start listen
app.listen(3000, () => {
  console.log('Example app listening on port 3000.')
})