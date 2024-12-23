```js
let q = sql().select("nTag").from("caisse").end();
console.log(q);
q = sql().select("nTag", "toto").from("caisse").end();
console.log(q);
q = sql().select("nTag", "toto").from("caisse").where("toto", "toto").and("popo", "pupu").end();
console.log(q);
q = sql().select("nTag", "toto").from("caisse").where("toto", "toto").or("popo", "pupu").end();
```