import { v4 as uuidv4 } from "uuid";
import { getCache } from "../helpers/CacheHelper";

function startSession() {
  console.log("sessionService.js:: startSession");
  return new Promise((resolve, reject) => {
    resolve(uuidv4());
  });
}

function updateSessionData(sessionId, variableName, variableValue, ttl=10000) {
  let updateObject = {}
  updateObject[variableName] =variableValue
    

  // console.log(`sessuibSErvices.js :: updateSessionDAta`)
  // console.log(updateObject)

  return new Promise((resolve, reject) => {
    const memcached = getCache();
    memcached.get(sessionId, function (err, data) {
      console.log(
        `sessionServices.js, updateSessionData ${sessionId} --- existing data in cache: ${data}`
      );
      if (err) reject(err);
      if (!data) {
        console.log("sessionServices.js, updateSessionData -->will set data");
        console.log(JSON.stringify(updateObject));
        memcached.set(sessionId, JSON.stringify(updateObject), ttl, function (
          err
        ) {
          if (err) reject(err);
          resolve("OK");
        });
      } else {
        let existingSessionData = JSON.parse(data);
        existingSessionData[variableName] = variableValue;
        console.log("sessionServices.js, updateSessionData --> will update data in cache to ")
        console.log(JSON.stringify(existingSessionData))
        memcached.replace(
          sessionId,
          JSON.stringify(existingSessionData),
          10000,
          function (err) {
            if (err) reject(err);
            resolve("OK");
          }
        );
      }
    });
  });
}

function getSessionData(sessionId, variableName) {
  return new Promise((resolve, reject) => {
    const memcached = getCache();
    memcached.get(sessionId, function (err, data) {
      if(err) reject(err)
      // console.log(
      //   `sessionServices.js, getSessionData --- got the data:: ${data}`
      // );
      resolve(JSON.parse(data)[variableName]);
    });
  });
}

export { updateSessionData, startSession, getSessionData };
