'use strict'
describe('camelToKebab', () => {
  const camelToKebab = require('../exercises/3-camelToKebab.js')
  it('exports a function', () => {
    expect(camelToKebab).toBeInstanceOf(Function)
  })
  it('transforms a camelCase string to a kebab-case - 0', () => {
    expect(camelToKebab('camelCase')).toStrictEqual('camel-case')
  })
  it('transforms a camelCase string to a kebab-case - 1', () => {
    expect(camelToKebab('CamelCase')).toStrictEqual('camel-case')
  })
  it('transforms a camelCase string to a kebab-case - 2', () => {
    expect(camelToKebab('camelWithNumber0')).toStrictEqual('camel-with-number-0')
  })
  it('transforms a camelCase string to a kebab-case - 3', () => {
    expect(camelToKebab('camelWith1AtCenter')).toStrictEqual('camel-with-1-at-center')
  })
  it('transforms a camelCase string to a kebab-case - 4', () => {
    expect(camelToKebab('camelWithABVT')).toStrictEqual('camel-with-abvt')
  })
  it('transforms a camelCase string to a kebab-case - 5', () => {
    expect(camelToKebab('camelWithABVTInCenter')).toStrictEqual('camel-with-abvt-in-center')
  })
})
