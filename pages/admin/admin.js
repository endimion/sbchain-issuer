import React from "react";
import axios from "axios";
import { SubmissionError } from "redux-form";

import {
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
  setUsers,
} from "../../store";
import Layout from "../../components/Layout";
import { connect } from "react-redux";
import {  Row, Col, Card } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import ActiaveEndorserButton from "../../components/ActivateEndorserButton";
import ActivateEndorserButton from "../../components/ActivateEndorserButton";


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
    this.sessionData = props.sessionData;
  }

  static async getInitialProps({ reduxStore, req }) {
    let users;
    let sealSession;
    if (typeof window === "undefined") {
      reduxStore.dispatch(setEndpoint(req.session.enpoint));
      let baseUrl = req.session.baseUrl ? `/${req.session.baseUrl}/` : "";
      reduxStore.dispatch(setBaseUrl(baseUrl));
      // reduxStore.dispatch(setServerSessionId(req.session.sealSession));
      users = req.session.users;
      reduxStore.dispatch(setUsers(users));
      sealSession = req.session.sealSession;
    } else {
      users = reduxStore.getState().users;
      //if ther is sessionData then there should be a session as well
      sealSession = reduxStore.getState().sealSession;
    }
    return {
      sealSession: reduxStore.getState().sealSession,
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

  render() {
    const tableStyle = {
      minWidth: "650",
      marginTop: "6rem",
    };

    return (
      <Layout>
        <Row>
          <Col>
            <TableContainer style={tableStyle} component={Paper}>
              <Table  aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Endorsers</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">VcType</TableCell>
                    <TableCell align="right">Verified</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.users.map((row) => {
                    console.log(row);
                    console.log(
                      row["vcType"].reduce((total, current) => {
                        total + " " + current;
                      }, "")
                    );
                    console.log(row["status"]);
                    return (
                      <TableRow key={row.email}>
                        <TableCell component="th" scope="row">
                          {row.email}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">
                          {row["vcType"].reduce((total, current) => {
                            return total + "\n" + current;
                          }, "")}
                        </TableCell>
                        <TableCell align="right">
                          {row.verified ? "Verified" : "UnVerified"}
                        </TableCell>
                        <TableCell align="right">
                          {row["status"] ? "Active" : "InActive"}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          <ActivateEndorserButton
                            active={row["status"]}
                            email={row.email}
                            users={this.props.users}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Col>
        </Row>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    sessionData: state.appReducer.sessionData,
    userSelection: state.appReducer.userSelection, // the attributes selected by the user to be included in a VC,
    baseUrl: state.appReducer.baseUrl,
    sealSession: state.appReducer.sealSession,
    endpoint: state.appReducer.endpoint,
    users: state.appReducer.users,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
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

    setTheUsers: (users) => {
      dispatch(setUsers(users));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterEndorser);
