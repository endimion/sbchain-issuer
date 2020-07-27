const uuidv1 = require("uuid/v1");
import { RegisterationService } from "../back-services/RegistrationService";
import { User } from "../model/User";
import { UsersRepo } from "../repository/UserRepo";
import { getCollection } from "../back-services/MongoClient";
import mailService, { sendRegisrationMail } from "../back-services/mailService";
import { getCache } from "../helpers/CacheHelper";
var crypto = require("crypto");

// const claimsCache = getCache();

async function registerEndorser(req, res) {
  let email = req.body.email;
  let vcType = req.body.vcType;
  let theUser = new User(email, vcType, false);
  let thedataBaseConnection = await getCollection();
  let theUserRepo = await UsersRepo(thedataBaseConnection);
  let users = await theUserRepo.findAll();
  let matchinusers = users.find((element) => {
    return element.email === email;
  });

  if (matchinusers) {
    if (
      Array.isArray(matchinusers.vcType) &&
      matchinusers.vcType.indexOf(vcType) < 0
    ) {
      matchinusers.vcType.push(vcType);
    }
    await theUserRepo.update(matchinusers);
  } else {
    theUser.vcType = [vcType];
    await theUserRepo.addUser(theUser);
    let uuid = uuidv1();
    let cache = getCache();
    cache.set(email, uuid, 10000, function (err) {
      if (err) {
        console.log(err);
      }
      console.log("added to cache ok");
    });

    await mailService.sendRegisrationMail(email, uuid);
    console.log("mail sent");
  }

  users = await theUserRepo.findAll();
  console.log("registrationController::  update values");
  users.forEach((element) => {
    console.log(element);
  });

  res.sendStatus(200);
}

async function verifyEmail(req, res) {
  let email = req.query.mail;
  let code = req.query.code;
  let cache = getCache();
  let thedataBaseConnection = await getCollection();
  let theUserRepo = await UsersRepo(thedataBaseConnection);

  cache.get(email, function (err, data) {
    if (err) {
      console.log("NO MATCH");
      res.send("ERROR");
    }

    if (data === code) {
      console.log("CODE MATCH");
      let users = theUserRepo.findAll().then((users) => {
        let matchUser = users.find((element) => {
          console.log("found a matching user");
          return element.email === email;
        });
        if (matchUser) {
          theUserRepo.updateEmailStatus(matchUser).then((resp) => {
            res.send("OK");
          });
        }
      });
    }
  });
}

async function getVerifiedEndorsers(req, res) {
  let thedataBaseConnection = await getCollection();
  let theUserRepo = await UsersRepo(thedataBaseConnection);
  let verifiedEmailUsers = [];
  theUserRepo.findAll().then((users) => {
    users.forEach((user) => {
      if (user.verified) {
        verifiedEmailUsers.push(user);
      }
    });
    res.send(verifiedEmailUsers);
  });
}

async function updateStatus(req, res) {
  let email = req.body.email
  let thedataBaseConnection = await getCollection();
  let theUserRepo = await UsersRepo(thedataBaseConnection);
  theUserRepo.findAll().then((users) => {
    let matchUser = users.find((element) => {
      return element.email === email;
    });
    if (matchUser) {
      theUserRepo.updateActivation(matchUser).then((resp) => {
        res.send("OK");
      });
    }
  });
}

export { registerEndorser, verifyEmail, getVerifiedEndorsers, updateStatus };
