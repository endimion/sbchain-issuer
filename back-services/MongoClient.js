const MongoClient = require("mongodb").MongoClient;

let db = null;
let usersCollection = null;

async function getCollection() {
  return new Promise(function (resolve, reject) {
    let url = process.env.MONGO?process.env.MONGO:"mongodb://localhost:27017";
    MongoClient.connect(url, {
      useUnifiedTopology: true,
    })
      .then((client) => {
        console.log("Connected to Database");
        db = client.db("sbchain");
        usersCollection = db.collection("endorsers");
        resolve(usersCollection);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

module.exports = {getCollection, db, usersCollection };
