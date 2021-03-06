import React from "react";
import axios from "axios";
import { SubmissionError } from "redux-form";

import {
  setSessionData,
  makeOnlyConnectionRequest,
  addSetToSelection,
  setStepperSteps,
  setEndpoint,
  setBaseUrl,
  // setServerSessionId,
  completeDIDAuth,
  makeSealSession,
  makeSessionWithDIDConnecetionRequest,
  setSealSession,
  setRegistrationVCType,
  setRegistrationEmail,
  setRegistrationFinished,
} from "../../store";
import Layout from "../../components/Layout";
import { connect } from "react-redux";
import { Button, Row, Col, Card, Container } from "react-bootstrap";
import HomeButton from "../../components/HomeButton";
import RegisterForm from "../../components/registerForm";

const transport = require("uport-transports").transport;
/*
  Secure flow:
  - check in session if DID is present. This is not only the DID of the user but the whole connection response
  - if it is not present:
    - first display DID connection request (QR etc.). The DID response endpoint should contain the session here
    - on response on the server, send a SSE to the front end, denoting that DID auth is completed and on the server there is the DID component
    - Display additional datasources
    - on VC issance request, do not display QR code etc, but send the credentials straigth to the users wallet

*/

class RegisterEndorser extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.isFetching = props.isFetching;
    this.sessionData = props.sessionData;
    this.hasRequiredAttributes =
      props.sessionData !== null &&
      props.sessionData !== undefined &&
      props.sessionData.ebill !== undefined;
  }

  static async getInitialProps({ reduxStore, req }) {
    let userSessionData;
    let DIDOk;
    let sealSession;
    if (typeof window === "undefined") {
      userSessionData = req.session.userData;
      reduxStore.dispatch(setEndpoint(req.session.enpoint));
      let baseUrl = req.session.baseUrl ? `/${req.session.baseUrl}/` : "";
      reduxStore.dispatch(setBaseUrl(baseUrl));
      // reduxStore.dispatch(setServerSessionId(req.session.sealSession));
      DIDOk = req.session.DID;
      sealSession = req.session.sealSession;
      console.log(
        `self.js:: in the server the seal session is:: ${req.session.sealSession}`
      );
    } else {
      if (reduxStore.getState().sessionData) {
        userSessionData = reduxStore.getState().sessionData;
        DIDOk = reduxStore.getState().DID;
        //if ther is sessionData then there should be a session as well
        sealSession = reduxStore.getState().sealSession;
      } else {
        console.log(`no server session data found`);
      }
    }

    //this way the userSessionData gets set in all settings
    if (userSessionData) {
      reduxStore.dispatch(setSessionData(userSessionData));
    }
    if (DIDOk) {
      reduxStore.dispatch(completeDIDAuth(sealSession));
      reduxStore.dispatch(setSealSession(sealSession));
    }

    //returned value here is getting mered with the mapstatetoprops
    // mapstatetoprops overrides these values if they match
    return {
      sessionData: userSessionData,
      qrData: reduxStore.getState().qrData,
      vcSent: false,
      sealSession: reduxStore.getState().sealSession,
      vcType: "",
    };
  }

  submit = (values) => {
    console.log(values);
    if (!values.email) {
      throw new SubmissionError({
        email: "email is required does not exist",
        _error: "email is required!",
      });
    }
    if (!this.props.vcType) {
      throw new SubmissionError({
        vcType: "Please select a VC type",
        _error: "VC type is required!",
      });
    } else {
      axios
        .post("/register", {
          email: values.email,
          vcType: this.props.vcType,
        })
        .then((data) => {
          console.log("registerd user");
          this.setRegFinished(true);
        })
        .catch((err) => {
          console.log("an error occured during registration");
        });
    }
  };

  handleChange = (event) => {
    console.log(`value changed to ${event.target.value}`);
    this.props.setVcType(event.target.value);
  };

  render() {
    if (this.props.registrationFinished) {
      return (
        <Layout>
          <Row>
            <Col>
            Please visit the email addresss you provided to verify your email
            </Col>
          </Row>
        </Layout>
      );
    }

    return (
      <Layout>
        <Row>
          <Col>
            <RegisterForm
              onSubmit={this.submit}
              handleChange={this.handleChange}
              vcType={this.props.vcType}
            />
          </Col>
        </Row>
        <Row>
          <HomeButton baseUrl={this.props.baseUrl} />
        </Row>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.appReducer.fetching,
    qrData: state.appReducer.qrData,
    sessionData: state.appReducer.sessionData,
    userSelection: state.appReducer.userSelection, // the attributes selected by the user to be included in a VC,
    baseUrl: state.appReducer.baseUrl,
    DID: state.appReducer.DID,
    uuid: state.appReducer.uuid,
    vcSent: state.appReducer.vcSent,
    sealSession: state.appReducer.sealSession,
    eidasUri: state.appReducer.eidasUri,
    eidasPort: state.appReducer.eidasPort,
    endpoint: state.appReducer.endpoint,
    eidasRedirectUri: state.appReducer.eidasRedirectUri,
    vcType: state.appReducer.vcType,
    registeredEmail: state.appReducer.registeredEmail,
    registrationFinished: state.appReducer.registrationFinished,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEBillToSession: (userSessionData) => {
      dispatch(setSessionData(userSessionData));
    },
    setSefToSelection: (set) => {
      dispatch(addSetToSelection(set));
    },
    setSteps: (steps) => {
      dispatch(setStepperSteps(steps));
    },
    setEndPoint: (endpont) => {
      dispatch(setEndpoint(endpoint));
    },
    makeConnectionRequest: (sealSession, baseUrl, isMobile) => {
      dispatch(makeOnlyConnectionRequest(sealSession, baseUrl, isMobile));
    },
    didAuthOK: (uuid) => {
      dispatch(completeDIDAuth(uuid));
    },
    startSealSession: (baseUrl) => {
      dispatch(makeSealSession(baseUrl));
    },
    startSessionAndDidAuth: (baseUrl, isMobile) => {
      dispatch(makeSessionWithDIDConnecetionRequest(baseUrl, isMobile));
    },
    setTheSealSession: (sessionId) => {
      dispatch(setSealSession(sessionId));
    },
    setVcType: (vcType) => {
      dispatch(setRegistrationVCType(vcType));
    },
    setEmail: (email) => {
      dispatch(setRegistrationEmail(email));
    },
    setRegFinished: (finished) => {
      dispatch(setRegistrationFinished(finished));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterEndorser);
