const express = require("express");
const next = require("next");
const ngrok = require("ngrok");
const https = require("https");
const http = require("http");
const port = parseInt(process.env.PORT, 10) || 5000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require("body-parser");
const session = require("express-session");
import { getSessionCache } from "./helpers/CacheHelper";
import { subscribe } from "./back-services/server-sent-events";

const onlyConnectionRequest = require("./back-controllers/controllers")
  .onlyConnectionRequest;
const onlyConnectionResponse = require("./back-controllers/controllers")
  .onlyConnectionResponse;
const onlyIssueVC = require("./back-controllers/controllers").onlyIssueVC;
const register = require("./back-controllers/registrationControllers")
  .registerEndorser;
const verifyEmail = require("./back-controllers/registrationControllers")
  .verifyEmail;
const updateStatus = require("./back-controllers/registrationControllers")
  .updateStatus;
const issuePowerSupply = require("./back-controllers/endorsedControllers")
  .issuePowerSupply;
const cacheRequestAndEmail = require("./back-controllers/endorsedControllers")
  .cacheRequestAndEmail;
const acceptEndorsement = require("./back-controllers/endorsedControllers")
  .acceptEndorsement;

import {
  sealIssueVC,
  issueBenefitVC,
} from "./back-controllers/sealApiControllers";
import {
  updateSessionData,
  getSessionData,
  startSession,
} from "./back-services/sessionServices";
import { RegisterationService } from "./back-services/RegistrationService";
import { UsersRepo } from "./repository/UserRepo";
import { getCollection } from "./back-services/MongoClient";

let endpoint = "";

const memoryStore = new session.MemoryStore();
//export NODE_ENV=production
const isProduction = process.env.NODE_ENV === "production";
const SESSION_CONF = {
  secret: "this is my super super secret, secret!! shhhh",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: memoryStore,
  // maxExpiration: 90000,
};

if (isProduction) {
  SESSION_CONF.store = getSessionCache(session);
}

// keycloack confniguration

const KeycloakMultiRealm = require("./back-services/KeycloakMultiRealm");
// const SEAL_EIDAS_URI=process.env.SEAL_EIDAS_URI?process.env.SEAL_EIDAS_URI:'vm.project-seal.eu'
// const SEAL_EIDAS_PORT=process.env.SEAL_EIDAS_PORT?process.env.SEAL_EIDAS_PORT:'8091'
// const SEAL_EDUGAIN_URI= process.env.SEAL_EDUGAIN_URI?process.env.SEAL_EDUGAIN_URI:'vm.project-seal.eu'
// const SEAL_EDUGAIN_PORT=process.env.SEAL_EDUGAIN_PORT?process.env.SEAL_EDUGAIN_PORT:''

const eidasRealmConfig = {
  realm: "eidas",
  "auth-server-url": "https://esmo-gateway.eu/auth",
  "ssl-required": "none",
  resource: "testClient",
  credentials: {
    secret: "317f5c96-dbf9-45f0-9c46-f8d7e7934b8c",
  },
  "confidential-port": 0,
};

const amkaRealm = {
  realm: "amka",
  "auth-server-url": "https://dss1.aegean.gr/auth",
  "ssl-required": "external",
  resource: "testClient",
  credentials: {
    secret: "13f54571-b5cb-40a1-a0c6-862c84b5ee94",
  },
  "confidential-port": 0,
};

const mitroRealm = {
  realm: "mitroPoliton",
  "auth-server-url": "https://dss1.aegean.gr/auth",
  "ssl-required": "external",
  resource: "mitroTest",
  credentials: {
    secret: "57e8d0b8-e0a2-48a9-81d9-38be4735773a",
  },
  "confidential-port": 0,
};

const SSI = {
  realm: "SSI",
  "auth-server-url": "https://dss1.aegean.gr/auth",
  "ssl-required": "external",
  resource: "testssi",
  credentials: {
    secret: "8c288fd3-14f9-4f1c-9e03-8ca8b3a3ec67",
  },
  "confidential-port": 0,
};

const SBPower = {
  realm: "sbadmin",
  "auth-server-url": "https://dss1.aegean.gr/auth",
  "ssl-required": "external",
  resource: "sbchain",
  credentials: {
    secret: "8a8afc9d-67d8-4823-9ec7-28e7033e259a",
  },
  "confidential-port": 0,
};

const taxisReaml = {
  realm: "taxis",
  "auth-server-url": "https://dss1.aegean.gr/auth",
  "ssl-required": "external",
  resource: "sbchain",
  credentials: {
    secret: "a8462c15-f0da-4403-9d90-698d1a5862d9",
  },
  "confidential-port": 0,
};

const keycloak = new KeycloakMultiRealm({ store: memoryStore }, [
  amkaRealm,
  eidasRealmConfig,
  mitroRealm,
  SSI,
  SBPower,
  taxisReaml,
]);

//end of keycloak config

app.prepare().then(() => {
  const server = express();
  server.set("trust proxy", 1); // trust first proxy
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json({ type: "*/*" }));

  // set session managment
  if (process.env.HTTPS_COOKIES === true) {
    SESSION_CONF.cookie.secure = true; // serve secure cookies, i.e. only over https, only for production
  }
  server.use(session(SESSION_CONF));
  server.use(keycloak.middleware());

  //start server sent events for the server
  server.get("/events", subscribe);

  server.get(["/home", "/"], (req, res) => {
    // console.log(`server.js-home::found existing session ${req.session.id}`);
    const mockData = {};
    if (!req.session.e1DetailsData) req.session.e1DetailsData = mockData;
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/", req.query);
  });

  /*
    ######################################
    #### SECURE CONTROLLERS ############//
  */

  server.post("/issueVCSecure", (req, res) => {
    req.endpoint = endpoint;
    console.log("server.js -- issueVCSecure::  issueVCSecure");
    return onlyIssueVC(req, res);
  });

  // ###############################################
  server.post(
    [
      "/onlyConnectionRequest",
      "/vc/issue/onlyConnectionRequest",
      "/vc/onlyConnectionRequest",
    ],
    (req, res) => {
      req.endpoint = endpoint;
      req.baseUrl = process.env.BASE_PATH;
      console.log(
        "server.js -- onlyConnectionRequest::  onlyConnectionRequest"
      );
      return onlyConnectionRequest(req, res);
    }
  );

  server.post(
    [
      "/onlyConnectionResponse",
      "/vc/issue/onlyConnectionResponse",
      "/vc/onlyConnectionResponse",
    ],
    (req, res) => {
      req.endpoint = endpoint;
      console.log(
        "server.js -- onlyConnectionResponse::  onlyConnectionResponse"
      );
      return onlyConnectionResponse(req, res);
    }
  );

  // ############################################### //#endregion

  /*
    ######################################
    #### SEAL Specific Controllers ############
    ########################################
  */
  server.post("/seal/issueVC", (req, res) => {
    req.endpoint = endpoint;
    console.log("server.js -- /seal/issueVC::  /seal/issueVC");
    return sealIssueVC(req, res);
  });

  server.post("/benefit/issue", (req, res) => {
    req.endpoint = endpoint;
    console.log("server.js -- benefit/issue::  benefit/issue");
    return issueBenefitVC(req, res);
  });

  server.post(["/vc/start-session"], async (req, res) => {
    let sessionId = await startSession();
    console.log(`server.js -- /vc/start-session:: just created ${sessionId}`);
    res.send({ sId: sessionId, code: "OK" });
  });

  // ################################################################33

  // ############ Protected by Keycloak Routes ####################
  server.get(
    ["/eidas/eidas-authenticate", "/issuer/eidas/eidas-authenticate"],
    keycloak.protect(),
    (req, res) => {
      console.log("we accessed a protected root!");
      // see mockJwt.json for example response
      const idToken = req.kauth.grant.access_token.content;
      const e1DetailsDetails = {
        given_name: idToken.given_name,
      };
      console.log(`server.js:: e1Details-details`);
      if (req.session.e1DetailsData) {
        req.session.e1DetailsData.eidas = e1DetailsDetails;
      } else {
        req.session.e1DetailsData = {};
        req.session.e1DetailsData.eidas = e1DetailsDetails;
      }
      req.endpoint = process.env.ENDPOINT; // this gets lost otherwise, on the server redirection
      req.session.baseUrl = process.env.BASE_PATH;
      return app.render(req, res, "/issue-eidas", req.query);
    }
  );

  server.get(
    ["/SSI/benefit-authenticate", "/sbchain/SSI/benefit-authenticate"],
    keycloak.protect(),
    async (req, res) => {
      console.log(`reached SSI/benefit-authenticate`);
      const sessionId = req.query.session;
      const idToken = req.kauth.grant.access_token.content;
      const taxisDetails = {
        afm: idToken.afm,
        loa: "low",
        source: "TAXIS",
      };
      //store response in cache
      console.log(`server.js SSI/benefit-authenticate , checking dataStore`);

      let dataStore = await getSessionData(sessionId, "dataStore");
      if (!dataStore) {
        dataStore = {};
      }

      console.log(`server.js SSI/benefit-authenticate , datastore ok`);
      dataStore["TAXIS"] = taxisDetails;
      await updateSessionData(sessionId, "dataStore", dataStore);
      console.log(`server.js SSI/benefit-authenticate , sessionData updated`);

      req.session.userData = { taxis: taxisDetails };
      req.session.sealSession = sessionId;
      req.session.DID = true;
      req.session.endpoint = endpoint;
      req.session.baseUrl = process.env.BASE_PATH;
      console.log(`server.js will render /vc/issue/benefit`);
      return app.render(req, res, "/vc/issue/benefit", req.query);
    }
  );

  server.get(
    [
      "/mitroPoliton/mitro-authenticate",
      "/issuer/mitroPoliton/mitro-authenticate",
    ],
    keycloak.protect(),
    async (req, res) => {
      const sessionId = req.query.session;
      const idToken = req.kauth.grant.access_token.content;
      console.log("server.js:: MITRO RESPONSE")
      console.log(idToken)
      const mitroDetails = {
        // birthcountry: idToken.birthcountry,
        // birthdate: idToken.birthdate,
        // birthmuniccomm: idToken.birthmuniccomm,
        // birthmunicipal: idToken.birthmunicipal,
        // birthmunicipalunit: idToken.birthmunicipalunit,
        // birthprefecture: idToken.birthprefecture,
        // eklspecialno: idToken.eklspecialno,
        // familyShare: idToken.familyShare,
        // fatherfirstname: idToken.fatherfirstname,
        // fathersurname: idToken.fathersurname,
        // firstname: idToken.firstname,
        // gainmunrecdate: idToken.gainmunrecdate,
        // gender: idToken.gender,
        // grnatgaindate: idToken.grnatgaindate,
        // mainnationality: idToken.mainnationality,
        // mansdecentraladmin: idToken.mansdecentraladmin,
        // mansmunicipalityname: idToken.mansmunicipalityname,
        // mansreckind: idToken.mansreckind,
        // mansrecordaa: idToken.mansrecordaa,
        // mansrecordyear: idToken.mansrecordyear,
        // maracountry: idToken.maracountry,
        // maramuniccomm: idToken.maramuniccomm,
        // maramunicipality: idToken.maramunicipality,
        // maraprefecture: idToken.maraprefecture,
        // marriageactdate: idToken.marriageactdate,
        // marriageactno: idToken.marriageactno,
        // marriageactro: idToken.marriageactro,
        // marriageacttomos: idToken.marriageacttomos,
        // marriageactyear: idToken.marriageactyear,
        // marriagerank: idToken.marriagerank,
        // member: idToken.member,
        // membertype: idToken.membertype,
        // merida: idToken.merida,
        // motherfirstname: idToken.motherfirstname,
        // mothergenos: idToken.mothergenos,
        // mothersurname: idToken.mothersurname,
        // municipalityname: idToken.municipalityname,
        // reckind: idToken.reckind,
        // secondname: idToken.secondname,
        // spouseagreementrank: idToken.spouseagreementrank,
        // spousemarriagerank: idToken.spousemarriagerank,
        // surname: idToken.surname,
        gender: idToken.gender,
        nationality: idToken.mainnationality,
        singleParent: idToken.spousemarriagerank ? "false" : "true",
        maritalStatus: idToken.marriagerank ? "married" : "divorced",
        motherLatin: idToken.motherEn,
        fatherLatin: idToken.fatherEn,
        nameLatin: idToken.nameEn,
        surnameLatin: idToken.surnameEn,
        birthdate: idToken.birthDate,
        amka: idToken.amka,
        parenthood: idToken.parenthood,
        protectedMembers: idToken.protectedMembers,
        custody:  idToken.marriagerank ?"true":idToken.custody,
        loa: "low",
        source: "MITRO",
      };

      //store response in cache
      let dataStore = await getSessionData(sessionId, "dataStore");
      if (!dataStore) {
        dataStore = {};
      }
      dataStore["MITRO"] = mitroDetails;
      await updateSessionData(sessionId, "dataStore", dataStore);
      dataStore = await getSessionData(sessionId, "dataStore");
      // make response available in front end
      if (req.session.userData) {
        req.session.userData.mitro = mitroDetails;
      } else {
        req.session.userData = {};
        req.session.userData.mitro = mitroDetails;
      }
      req.session.baseUrl = process.env.BASE_PATH;

      req.session.DID = true;
      req.session.sealSession = sessionId;

      return app.render(req, res, "/vc/issue/mitro", req.query);
    }
  );

  server.get(
    ["/amka/amka-authenticate", "/issuer/amka/amka-authenticate"],
    keycloak.protect(),
    async (req, res) => {
      console.log("amka Protected Roort");
      console.log(
        `/amka/amka-authenticate cache sessionId number:: ${req.query.session}`
      );
      const sessionId = req.query.session;
      const idToken = req.kauth.grant.access_token.content;
      // console.log(idToken)
      const amkaDetails = {
        latinLastName: idToken.latinLastName,
        birthDate: idToken.birthDate,
        latinFirstName: idToken.latinFirstName,
        father: idToken.fatherEN,
        mother: idToken.motherEn,
        loa: "low",
        source: "AMKA",
      };
      //store response in cache
      let dataStore = await getSessionData(sessionId, "dataStore");
      if (!dataStore) {
        dataStore = {};
      }
      dataStore["AMKA"] = amkaDetails;
      await updateSessionData(sessionId, "dataStore", dataStore);
      dataStore = await getSessionData(sessionId, "dataStore");
      // console.log(dataStore);
      // make response available in front end
      if (req.session.e1DetailsData) {
        req.session.e1DetailsData.amka = amkaDetails;
      } else {
        req.session.e1DetailsData = {};
        req.session.e1DetailsData.amka = amkaDetails;
      }
      req.session.baseUrl = process.env.BASE_PATH;

      req.session.DID = true;
      req.session.sealSession = sessionId;

      return app.render(req, res, "/vc/issue/amka", req.query);
    }
  );

  // server.get(
  //   ["/taxis/taxis-authenticate", "/sbchain/taxis/taxis-authenticate"],
  //   // keycloak.protect(),
  //   async (req, res) => {
  //     const sessionId = req.query.session;
  //     console.log(`server.js  ---> taxis/taxis-authenticate I go the sesionID`)
  //     console.log(sessionId);
  //     // const idToken = req.kauth.grant.access_token.content;
  //     const taxisDetails = {
  //       afm: "070892XX",
  //       amka: "051083046XX",
  //       lastName: "Τριανταφύλλου",
  //       fistName: "Νικόλαος",
  //       fathersName: "Αναστάσιος",
  //       mothersName: "Αγγελική",
  //       fathersNameLatin: "Anastasios",
  //       mothersNameLatin: "Aggeliki",
  //       firstNameLatin: "Nikolaos",
  //       lastNameLatin: "Triantafyllou",
  //       gender: "male",
  //       nationality: "Greek",
  //       loa: "low",
  //       source: "TAXIS",
  //       dateOfBirth:"05/10/1983",
  //       householdComposition: [{name:"Katerina",relation:"wife"},{name:"xx",relation:"daughter"}],
  //       address: {
  //         street: "Καλλ***",
  //         streetNumber: "**",
  //         PO: "15***",
  //         municipality: "Ζ**",
  //         prefecture: "Αττικής"

  //       }
  //     };

  //     //store response in cache
  //     let dataStore = await getSessionData(sessionId, "dataStore");
  //     if (!dataStore) {
  //       dataStore = {};
  //     }
  //     dataStore["TAXIS"] = taxisDetails;
  //     await updateSessionData(sessionId, "dataStore", dataStore);
  //     dataStore = await getSessionData(sessionId, "dataStore");
  //     if (req.session.userData) {
  //       req.session.userData.taxis = taxisDetails;
  //     } else {
  //       req.session.userData = {};
  //       req.session.userData.taxis = taxisDetails;
  //     }
  //     req.session.baseUrl = process.env.BASE_PATH;

  //     req.session.DID = true;
  //     req.session.sealSession = sessionId;

  //     return app.render(req, res, "/vc/issue/taxis", req.query);
  //   }
  // );

  server.get(
    ["/taxis/taxis-authenticate", "/sbchain/taxis/taxis-authenticate"],
    keycloak.protect(),
    async (req, res) => {
      console.log("we accessed a protected root!");
      const sessionId = req.query.session;
      // see mockJwt.json for example response
      const idToken = req.kauth.grant.access_token.content;
      const taxisDetails = {
        fistName: idToken.fistName ,//"Νικόλαος",
        afm: idToken.afm,
        lastName: idToken.lastName, //"Τριανταφύλλου",
        fathersName: idToken.fathersName,
        mothersName: idToken.mothersName,
        dateOfBirth: idToken.dateOfBirth, //"05/10/1983",
        loa: "low",
        source: "TAXIS",
      };
      //store response in cache
      let dataStore = await getSessionData(sessionId, "dataStore");
      if (!dataStore) {
        dataStore = {};
      }
      dataStore["TAXIS"] = taxisDetails;
      await updateSessionData(sessionId, "dataStore", dataStore);
      dataStore = await getSessionData(sessionId, "dataStore");
      if (req.session.userData) {
        req.session.userData.taxis = taxisDetails;
      } else {
        req.session.userData = {};
        req.session.userData.taxis = taxisDetails;
      }
      req.session.baseUrl = process.env.BASE_PATH;

      req.session.DID = true;
      req.session.sealSession = sessionId;

      return app.render(req, res, "/vc/issue/taxis", req.query);
    }
  );

  server.get(["/e1/getData", "/issuer/e1/getData"], async (req, res) => {
    const sessionId = req.query.session;
    const e1MockUrl = process.env.E1MOCK || "http://localhost:4000";
    const name = req.query.name;
    const surname = req.query.surname;
    const dateOfBirth = req.query.dateOfBirth;

    let httpClient = process.env.E1MOCK ? https : http;

    httpClient
      .get(
        `${e1MockUrl}/getUser?name=${name}&surname=${surname}&dateOfBirth=${dateOfBirth}`,
        async (resp) => {
          let data = "";
          // A chunk of data has been recieved.
          resp.on("data", (chunk) => {
            data += chunk;
          });
          // The whole response has been received. Print out the result.
          resp.on("end", async () => {
            // console.log("the data is ")
            // console.log(data);
            let e1Details = JSON.parse(data).users;
            e1Details.source = "E1";
            e1Details.loa = "low";
            console.log("E1 DETAILS IS::");
            console.log(e1Details);
            let dataStore = await getSessionData(sessionId, "dataStore");
            if (!dataStore) {
              dataStore = {};
            }
            dataStore["E1"] = e1Details;
            await updateSessionData(sessionId, "dataStore", dataStore);
            dataStore = await getSessionData(sessionId, "dataStore");
            if (req.session.userData) {
              req.session.userData.e1 = e1Details;
            } else {
              req.session.userData = {};
              req.session.userData.e1 = e1Details;
            }
            req.session.baseUrl = process.env.BASE_PATH;
            req.session.DID = true;
            req.session.sealSession = sessionId;
            return app.render(req, res, "/vc/issue/e1", req.query);
            // res.status(200).send(e1Details);
          });
        }
      )
      .on("error", (err) => {
        console.log("Error: " + err.message);
        res.status(500).send(err.message);
      });
  });

  server.post(["/self/store", "/issuer/self/store"], async (req, res) => {
    console.log("server.js:: /self/store");

    const sessionId = req.body.session;
    const selfDetails = req.body.details;
    selfDetails.loa = "low";
    selfDetails.source = "self";

    console.log(sessionId);
    console.log(selfDetails);
    //store response in cache
    let dataStore = await getSessionData(sessionId, "dataStore");
    if (!dataStore) {
      dataStore = {};
    }
    dataStore["self"] = selfDetails;
    await updateSessionData(sessionId, "dataStore", dataStore);
    dataStore = await getSessionData(sessionId, "dataStore");
    console.log(dataStore);
    return res.sendStatus(200);
  });

  server.post(["/ebill/store", "/issuer/ebill/store"], async (req, res) => {
    console.log("server.js:: /self/store");

    const sessionId = req.body.session;
    const eBillDetails = req.body.details;
    eBillDetails.loa = "low";
    eBillDetails.source = "ebill";
    //store response in cache
    let dataStore = await getSessionData(sessionId, "dataStore");
    if (!dataStore) {
      dataStore = {};
    }
    dataStore["ebill"] = eBillDetails;
    await updateSessionData(sessionId, "dataStore", dataStore);
    dataStore = await getSessionData(sessionId, "dataStore");
    console.log(dataStore);
    return res.sendStatus(200);
  });

  server.post(["/contact/store", "/issuer/contact/store"], async (req, res) => {
    console.log("server.js:: /self/store");

    const sessionId = req.body.session;
    const contactDetails = req.body.details;
    contactDetails.loa = "low";
    contactDetails.source = "contact";
    //store response in cache
    let dataStore = await getSessionData(sessionId, "dataStore");
    if (!dataStore) {
      dataStore = {};
    }
    dataStore["contact"] = contactDetails;
    await updateSessionData(sessionId, "dataStore", dataStore);
    dataStore = await getSessionData(sessionId, "dataStore");
    console.log(dataStore);
    return res.sendStatus(200);
  });

  server.post(
    ["/mitro-mock/store", "/issuer/mitro-mock/store"],
    async (req, res) => {
      console.log("server.js:: /mitro-mock/store");
      const sessionId = req.body.session;
      const contactDetails = req.body.details;
      contactDetails.loa = "low";
      contactDetails.source = "mitro";
      //store response in cache
      let dataStore = await getSessionData(sessionId, "dataStore");
      if (!dataStore) {
        dataStore = {};
      }
      dataStore["mitro"] = contactDetails;
      await updateSessionData(sessionId, "dataStore", dataStore);
      dataStore = await getSessionData(sessionId, "dataStore");
      console.log(dataStore);
      return res.sendStatus(200);
    }
  );

  server.get(["/vc/issue/amka"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/amka", req.query);
  });

  server.get(["/vc/issue/contact"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/contact", req.query);
  });

  server.get(["/vc/issue/e1"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/e1", req.query);
  });

  server.get(["/vc/issue/ebill"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/ebill", req.query);
  });

  server.get(["/vc/issue/mitro"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/mitro", req.query);
  });

  server.get(["/vc/issue/mitromock"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/mitromock", req.query);
  });

  server.get(["/vc/issue/self"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/self", req.query);
  });

  server.get(["/vc/issue/taxis"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/taxis", req.query);
  });

  server.get(["/vc/issue/benefit"], async (req, res) => {
    req.session.endpoint = endpoint;
    req.session.baseUrl = process.env.BASE_PATH;
    return app.render(req, res, "/vc/issue/benefit", req.query);
  });

  server.post("/register", async (req, res) => {
    return register(req, res);
  });

  server.get("/verify", async (req, res) => {
    return verifyEmail(req, res);
  });

  //keycloak.protect()
  server.get("/sbadmin/admin", async (req, res) => {
    let regServ = await RegisterationService(
      await UsersRepo(await getCollection())
    );
    let verifiedUsers = await regServ.getVerifiedUsers();
    req.session.users = verifiedUsers;
    return app.render(req, res, "/admin/admin", req.query);
  });

  server.post("/activate", async (req, res) => {
    return updateStatus(req, res);
  });

  server.get("/endorse/issue/powersupply", async (req, res) => {
    console.log("server.js rendering issuePowerSupply");
    return issuePowerSupply(req, res, app);
  });

  server.post("/endorse/cacheRequest", async (req, res) => {
    console.log("server.js /endorse/cacheRequest");
    req.session.endpoint = endpoint;
    return cacheRequestAndEmail(req, res);
  });

  server.get("/acceptEndorsement", async (req, res) => {
    console.log("server.js /endorse/acceptEndorsement");
    req.session.endpoint = endpoint;
    return acceptEndorsement(req, res, app);
  });

  // #############################################################################

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;

    if (isProduction) {
      console.log(
        `running in production is ${isProduction} and port is ${port}`
      );
      endpoint = process.env.ENDPOINT;
    } else {
      ngrok.connect(port).then((ngrokUrl) => {
        endpoint = ngrokUrl;
        console.log(`running, open at ${endpoint}`);
      });
    }
  });
});
