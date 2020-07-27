import { RegisterationService } from "../back-services/RegistrationService";
import { UsersRepo } from "../repository/UserRepo";
import { getCollection } from "../back-services/MongoClient";
import { setCachePromise, getCachePromise } from "../helpers/CacheHelper";
import EndorseRequest from "../model/endoreCacheModel";
import { sendEndorsementRequestMail } from "../back-services/mailService";
const { Credentials } = require("uport-credentials");
const pushTransport = require("uport-transports").transport.push;
import { mySigner } from "../back-services/hsmSigner";
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
const uuidv1 = require("uuid/v1");


const providerConfig = { rpcUrl: 'https://mainnet.infura.io/v3/051806cbbf204a4886f2ab400c2c20f9' }
const resolver = new Resolver(getResolver(providerConfig))

const credentials = new Credentials({
  appName: "MyIssuer",
  did: "did:ethr:0xd502a2c71e8c90e82500a70683f75de38d57dd9f",
  signer: mySigner,
  resolver
});


async function issuePowerSupply(req, res, app) {
  let regServ = await RegisterationService(
    await UsersRepo(await getCollection())
  );
  let verifiedUsers = await regServ.getVerifiedUsers().then((usersArray) => {
    let users = usersArray.filter((user) => {
      return user.vcType.indexOf("address") >= 0;
    });
    req.session.users = users;
    return app.render(req, res, "/endorse/issue/powersupply", req.query);
  });
}

async function cacheRequestAndEmail(req, res) {
  let endorserEmail = req.body.endorserEmail;
  let credential = req.body.credential; // stringified json value
  let sessionId = req.body.sessionId;
  let uuid = uuidv1();
  let cachedConnectionResponse =await getCachePromise(sessionId)
    // console.log(cachedConnectionResponse) 
  let didResponse = JSON.parse(cachedConnectionResponse).DID;

  // console.log("endorsedControllers.js :: cacheRequestAndEmail")
  // console.log(didResponse)

  let toCache = new EndorseRequest(
    endorserEmail,
    didResponse,
    credential,
    uuid
  );
  //caching request for three days
  await setCachePromise(uuid, toCache, 300000);

  let regServ = await RegisterationService(
    await UsersRepo(await getCollection())
  );
  await regServ.getVerifiedUsers().then(async (users) => {
    let endorsersFound = users.filter((user) => {
      console.log(`checking ${user.email} vs ${endorserEmail}`);
      return user.email === endorserEmail;
    });
    try {
      console.log(`found the following endorsers`);
      console.log(endorsersFound);
      let endorser = endorsersFound[0];
      let baseUrl = req.session.baseUrl?req.session.baseUrl:""
      await sendEndorsementRequestMail(
        endorser.email,
        `${req.session.endpoint}${baseUrl}/acceptEndorsement?uuid=${uuid}`,
        `${req.session.endpoint}${baseUrl}/reject?uuid=${uuid}`,
        credential
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
}

async function acceptEndorsement(req, res, app) {
  let uuid = req.query.uuid;
  let endorseRequest = await getCachePromise(uuid);
  if (!endorseRequest) {
    res.send("ERROR");
  } else {
      console.log(endorseRequest)
    let didResp = JSON.parse(endorseRequest.did);
    console.log(didResp)
    credentials
      .createVerification({
        sub: didResp.did,
        exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
        claim: JSON.parse(endorseRequest.cred),
        vc: ["/ipfs/QmNbicKYQKCsc7GMXSSJMpvJSYgeQ9K2tH15EnbxTydxfQ"],
      })
      .then((attestation) => {
        let push = pushTransport.send(didResp.pushToken, didResp.boxPub);
        return push(attestation);
      })
      .then((pushed) => {
        return app.render(req, res, "/endorse/accept", req.query);
      });
  }
}

export { issuePowerSupply, cacheRequestAndEmail,acceptEndorsement };
