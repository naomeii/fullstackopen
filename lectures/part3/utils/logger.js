const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

// The file exports an obj that has 2 fields, both of which are functions
module.exports = {
  info, error
}

// The functions can then be used in 2 diff ways:

// 1.
// const logger = require('./utils/logger')
// logger.info('message')
// logger.error('error message')

// 2.
// const { info, error } = require('./utils/logger')

// info('message')
// error('error message')