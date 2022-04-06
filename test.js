'use strict'

import test from 'tape'
import {
  Range,
  RANGE_EMPTY,
  RANGE_LB_INC,
  RANGE_UB_INC,
  RANGE_LB_INF,
  RANGE_UB_INF,

  parse,
  serialize
} from './index.js'

test('parse', function (t) {
  const string = parse

  t.deepEqual(string('empty'), new Range(null, null, RANGE_EMPTY), 'empty')

  t.deepEqual(string('(,)'), new Range(null, null, RANGE_LB_INF | RANGE_UB_INF), '(,)')
  t.deepEqual(string('(-infinity,infinity)'), new Range(null, null, RANGE_LB_INF | RANGE_UB_INF), '(-infinity,infinity)')

  t.deepEqual(string('(0,)'), new Range('0', null, RANGE_UB_INF), '(0,)')
  t.deepEqual(string('(0,10)'), new Range('0', '10', 0), '(0,10)')
  t.deepEqual(string('(,10)'), new Range(null, '10', RANGE_LB_INF), '(,10)')

  t.deepEqual(string('(0,1]'), new Range('0', '1', RANGE_UB_INC), '(0,1]')
  t.deepEqual(string('[0,1]'), new Range('0', '1', RANGE_LB_INC | RANGE_UB_INC), '[0,1]')
  t.deepEqual(string('[0,1)'), new Range('0', '1', RANGE_LB_INC), '[0,1)')

  t.end()
})

test('parse: integer', function (t) {
  const integer = value => parse(value, x => parseInt(x, 10))

  t.deepEqual(integer('empty'), new Range(null, null, RANGE_EMPTY), 'empty')

  t.deepEqual(integer('(,)'), new Range(null, null, RANGE_LB_INF | RANGE_UB_INF), '(,)')

  t.deepEqual(integer('(0,)'), new Range(0, null, RANGE_UB_INF), '(0,)')
  t.deepEqual(integer('(0,10)'), new Range(0, 10, 0), '(0,10)')
  t.deepEqual(integer('(,10)'), new Range(null, 10, RANGE_LB_INF), '(,10)')

  t.deepEqual(integer('(0,1]'), new Range(0, 1, RANGE_UB_INC), '(0,1]')
  t.deepEqual(integer('[0,1]'), new Range(0, 1, RANGE_LB_INC | RANGE_UB_INC), '[0,1]')
  t.deepEqual(integer('[0,1)'), new Range(0, 1, RANGE_LB_INC), '[0,1)')

  t.end()
})

test('parse: strings', function (t) {
  const check = (a, b) => t.deepEqual(parse(a), b, a)

  check('(,"")', new Range(null, '', RANGE_LB_INF))
  check('("",)', new Range('', null, RANGE_UB_INF))
  check('(A,Z)', new Range('A', 'Z', 0))
  check('("A","Z")', new Range('A', 'Z', 0))
  check('("""A""","""Z""")', new Range('"A"', '"Z"', 0))
  check('("\\"A\\"","\\"Z\\"")', new Range('"A"', '"Z"', 0))
  check('("\\(A\\)","\\(Z\\)")', new Range('(A)', '(Z)', 0))
  check('("\\[A\\]","\\[Z\\]")', new Range('[A]', '[Z]', 0))

  t.end()
})

test('serialize: strings', function (t) {
  const check = (a, b) => t.deepEqual(a, serialize(b), a)

  check('(,"")', new Range(null, '', RANGE_LB_INF))
  check('("",)', new Range('', null, RANGE_UB_INF))
  check('("""A""","""Z""")', new Range('"A"', '"Z"', 0))
  check('("\\\\A\\\\","\\\\Z\\\\")', new Range('\\A\\', '\\Z\\', 0))
  check('("(A)","(Z)")', new Range('(A)', '(Z)', 0))
  check('("[A]","[Z]")', new Range('[A]', '[Z]', 0))

  t.end()
})

test('roundtrip', function (t) {
  const trip = raw => t.is(serialize(parse(raw)), raw, raw)

  trip('empty')
  trip('(0,)')
  trip('(0,10)')
  trip('(,10)')
  trip('(0,1]')
  trip('[0,1]')
  trip('[0,1)')

  t.end()
})
