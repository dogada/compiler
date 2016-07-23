'use strict'

var debug = require('debug')('compiler:devtools')
var sm = require('source-map')
var convertSourceMap = require('convert-source-map')

exports.parseInlineSourceMap = function (content) {
  return convertSourceMap.fromSource(content)
}

/**
   Source map builder.
   @param {string} source - original content of a tag
   @param {string} filename - filename of a tag, i.e. `hello.tag`
   @param {int} offset - initial offset for the source map
*/
var SourceMap = exports.SourceMap = function (source, filename, offset) {
  this.source = source
  this.map = new sm.SourceMapGenerator({})
  this.offset = offset || 0
  this.sourceFilename = filename
  debug('SourceMap', filename, 'offset: ', offset)
  if (source) this.addSourceContent(source, filename)
}

SourceMap.prototype.addSourceContent = function (content, filename) {
  debug('addSourceContent', content.length, filename)
  this.map._sources.add(filename)
  this.map.setSourceContent(filename, content)
}

/**
   Add chunk's mappings and optionaly shift them to match the original
   position of chunk in the source.
   @param {string} code - generated js code
   @param {object} map - generated source map for the chunk of code
   @param {int} position - position of original chunk of code in the source
*/
SourceMap.prototype.addSourceChunk = function (code, map, position) {
  debug('addSourceChunk ', this.sourceFilename, 'position:', position,
        'offset:', this.offset, 'map:', map)
  this._appendMapping(this.sourceFilename, map, this.offset, position)
  this.offset += code.split('\n').length
}

/**
   Embedd source map into current source map with given offset.
   @param {object} map - source map
   @param {int} offset - offset in final (compiled) file
*/
SourceMap.prototype.addSourceMap = function (map, offset) {
  debug('addSourceMap', offset, map)
}

SourceMap.prototype._appendMapping = function (source, map, offset, position) {
  var target = this.map
  var consumer = new sm.SourceMapConsumer(map)
  consumer.eachMapping(function (mapping) {
    target._mappings.add({
      generatedLine: mapping.generatedLine + offset,
      generatedColumn: mapping.generatedColumn,
      originalLine: mapping.originalLine + position,
      originalColumn: mapping.originalColumn,
      source: source
    })
  })
}

SourceMap.prototype.toComment = function () {
  return '\n' + convertSourceMap.fromObject(this.map).toComment() + '\n'
}
