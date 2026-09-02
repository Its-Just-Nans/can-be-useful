'use strict'
/* # Exercice: Camel To Kebab
 *
 * ## Explanation:
 * You must code a function that transforms a string from camelCase (see Further Notice) to
 * kebab-case (see Further Notice). This function must not break abreviations.
 *
 * ## Example:
 *```
 *camelToKebab('CamelCaseString') === 'camel-case-string'
 *camelToKebab('CamelCaseStringWithABREV') === 'camel-case-string-with-abrev'
 *camelToKebab('CamelCaseStringWithABREVInCenter') === 'camel-case-string-with-abrev-in-center'
 *```
 *
 * ## Expected Time
 * You should spend around 15 minutes on this exercice
 *
 * ## Further Notice
 * - You have more examples in <root>/validations/3-camelToKebab.validation.js
 * - See [camelCase](https://en.wikipedia.org/wiki/Camel_case)
 * - See [kebabCase](http://wiki.c2.com/?KebabCase)
 */

function is_numeric(str) {
  return /^\d+$/.test(str);
}

const kebabize = str => {
  const a = str.split("");
  return a.map((letter, idx) => {
    if (is_numeric(letter)) {
      return `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`;
    } else {
      if (letter.toUpperCase() === letter) {
        const befor = a[idx - 1];
        const after = idx + 1 > a.length ? null : a[idx + 1]
        if (after && after.toUpperCase() == after) {
          if (befor && befor.toUpperCase() == befor) {
            return `${letter.toLowerCase()}`
          } else {
            return `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
          }
        } else {
          if (idx == (a.length - 1)) {
            return `${letter.toLowerCase()}`
          }
          return `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        }
      } else {
        return letter;
      }
    }
  }).join('');
}

function camelToKebab(str) {
  return kebabize(str)
}

module.exports = camelToKebab
