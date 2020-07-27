// import { usersCollection} from "../service/MongoClient";

const { request } = require("express");

function UsersRepo(usersCollection) {
  async function findAll() {
    return new Promise((resolve, reject) => {
      usersCollection
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          resolve(results);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  async function addUser(user) {
    usersCollection.insertOne(user);
  }

  async function update(user) {
    let newValues = { $set: { email: user.email, vcType: user.vcType } };
    usersCollection.updateOne({ email: user.email }, newValues);
  }

  async function updateActivation(user) {
    let updatedStatus = !user.status
    let newValues = { $set: { status:updatedStatus } };
    usersCollection.updateOne({ email: user.email }, newValues);
  }


  async function updateEmailStatus(user) {
    let newValues = { $set: { verified: true } };
    console.log(`updating user by ${user.email}`);
    usersCollection.updateOne({ email: user.email }, newValues);
  }



  async function findByNameSurnameDateOfBirth(name, surname, dateOfBirth) {
    console.log(`looking for ${name} ${surname} ${dateOfBirth}`);
    return new Promise((resolve, reject) => {
      usersCollection
        .findOne({ name: name, surname: surname, dateOfBirth: dateOfBirth })
        .then((results) => {
          console.log("The query results are!!!");
          console.log(results);
          resolve(results);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  return {
    findAll,
    addUser,
    findByNameSurnameDateOfBirth,
    update,
    updateEmailStatus,
    updateActivation
  };
}

module.exports = { UsersRepo };
