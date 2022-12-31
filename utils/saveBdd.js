const fs = require("fs");

/**
 * @description save bdd with bdd name and bdd object
 * @param {*} bdd
 * @param {string} bddName
 */
function Savebdd(bdd, bddName) {
  fs.writeFile(`./db/${bddName}.json`, JSON.stringify(bdd, null, 2), (err) => {
    if (err) throw err;
  });
}
module.exports = { Savebdd };
