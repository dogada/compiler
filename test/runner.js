/* global describe, expect:true, compiler:true */
/* eslint no-unused-vars: 0 */

// disable inline source maps for testing because they added to the
// generated javascript
if (typeof process !== 'undefined') process.env.RIOTJS_SOURCE_MAP = 'off'

describe('Compiler Tests', function () {
  expect = require('expect.js')
  compiler = require('../')
  require('./specs/html')
  require('./specs/css')
  require('./specs/js')
  require('./specs/tag')
  require('./specs/parsers/_suite')
})
