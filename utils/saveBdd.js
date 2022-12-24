const fs = require("fs");

function Savebdd(bdd) {
  fs.writeFile("./db/posts.json", JSON.stringify(bdd, null, 2), (err) => {
    if (err) throw err;
  });
}
module.exports = { Savebdd };
