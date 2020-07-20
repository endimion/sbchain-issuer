import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
// get our fontawesome imports
import {
  faArrowCircleRight,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  loginClicked,
  setUserAttributeSelection,
  setSessionData,
  setServerSessionId,
  setEndpoint,
  increaseCardIndex,
  decreaseCardIndex,
  setBaseUrl,
} from "../store";
import Layout from "../components/Layout";
import { Button, Row, Col, Card } from "react-bootstrap";
const jwt = require("jsonwebtoken");
import { getPath } from "../helpers/pathHelper";
import isMobile from "../helpers/isMobile";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.clickMe = this.clickMe.bind(this);
    this.increaseCardIndex = this.increaseCardIndex.bind(this);
    this.decreaseCardIndex = this.decreaseCardIndex.bind(this);

    this.isFetching = props.isFetching;
    this.sessionData = props.sessionData;
    // this.userEidas = props.userEidas;
    // this.userEduGain = props.userEduGain;
    this.userSelection = props.userSelection;
  }

  static async getInitialProps({ reduxStore, req }) {
    const serverIsFetching = reduxStore.getState().fetching;
    // console.log(`serverIsFetching ${serverIsFetching}`);
    let userSessionData;
    let serverSessionId;
    let endpoint;
    let baseUrl;

    if (typeof window === "undefined") {
      userSessionData = req.session.userData; // the user attributes
      serverSessionId = req.session.id; // the sessionId that exists on the backend server
      // this is stored on the redux store to use it on the client side components
      endpoint = req.session.endpoint;

      reduxStore.dispatch(setServerSessionId(serverSessionId));
      reduxStore.dispatch(setEndpoint(endpoint));
      baseUrl = req.session.baseUrl ? `/${req.session.baseUrl}/` : "";
      console.log(`index.js setting baseurl to: ${baseUrl}`);
      reduxStore.dispatch(setBaseUrl(baseUrl));
    } else {
      if (reduxStore.getState().sessionData) {
        // console.log(`user data is defined already ${sessionData}`);
        userSessionData = reduxStore.getState().sessionData;
      } else {
        console.log(`no server session data found`);
      }
    }

    reduxStore.dispatch(setSessionData(userSessionData)); //add the userEidas data to the reduxstore to be able to get it from other componets as well
    reduxStore.dispatch(setUserAttributeSelection([]));
    //returned value here is getting mered with the mapstatetoprops
    // mapstatetoprops overrides these values if they match
    return {
      isFetching: serverIsFetching,
      sessionData: userSessionData,
      userSelection: userSessionData ? userSessionData.userSelection : null,
      qrData: reduxStore.getState().qrData,
      baseurl: reduxStore.getState().baseUrl,
      serverSessionId: reduxStore.getState().serverSessionId,
    };
  }

  componentDidMount() {
    const { dispatch, sessionData } = this.props;
  }

  componentWillUnmount() {}

  clickMe() {
    this.dispatch(loginClicked());
  }

  increaseCardIndex() {
    this.props.incCardIndex();
  }
  decreaseCardIndex() {
    this.props.decCardIndex();
  }

  render() {
    let cards = [
      <Card style={{ minHeight: "47rem" }}>
        <Card.Header style={{minHeight:"6rem"}}>
          Issue a VC containing Personal Information retrieved from the TAXIS
        </Card.Header>
        <Card.Img
          style={{ height: "10rem" ,padding:"1rem"}}
          variant="top"
          src={getPath("aade.jpg")}
        />
        <Card.Body>
          <Card.Title style={{height:"5rem"}}>
            Click Next to generate a Verifiable Credential from the TAXIS
            registery.
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Available for all Greek citizens
          </Card.Subtitle>
          <Card.Text style={{height:"11rem"}}>
            You will be required  authenticate over the TAXIS network
            <br />
            This service will next issue a Verifiable Credential containing the
            retrieved data.
          </Card.Text>
          <Card.Link href="#">
            <Link href={`${this.props.baseUrl}vc/issue/taxis`}>
              <Button variant="primary">Next</Button>
            </Link>
          </Card.Link>
        </Card.Body>
      </Card>,

      <Card style={{ minHeight: "47rem" }}>
        <Card.Header style={{minHeight:"6rem"}}>
          Issue a VC containing Personal Information retrieved from the A.M.K.A
          registery
        </Card.Header>
        <Card.Img
          style={{ height: "10rem" ,padding:"1rem"}}
          variant="top"
          src={getPath("amka.jpeg")}
        />
        <Card.Body>
          <Card.Title style={{height:"5rem"}}>
            Click Next to generate a Verifiable Credential from the AMKA
            registery.
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Available for all Greek citizens
          </Card.Subtitle>
          <Card.Text style={{height:"11rem"}}>
            You will be required provide personal information to query the
            A.M.K.A registery
            <br />
            This service will next issue a Verifiable Credential containing the
            retrieved data.
          </Card.Text>
          <Card.Link href="#">
            <Link href={`${this.props.baseUrl}vc/issue/amka`}>
              <Button variant="primary">Next</Button>
            </Link>
          </Card.Link>
        </Card.Body>
      </Card>,

      <Card style={{ minHeight: "47rem" }}>
        <Card.Header style={{minHeight:"6rem"}}>
          Issue a Mitro-Politon based Verifiable Credential
        </Card.Header>
        <Card.Img
          style={{ height: "10rem" ,padding:"1rem"}}
          variant="top"
          src={getPath("mitro.png")}
        />
        <Card.Body>
          <Card.Title style={{height:"5rem"}}>
            Click Next to generate Verifiable Credential from the data of
            "Mitro-Politon"
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Available for all Greek Citizens
          </Card.Subtitle>
          <Card.Text style={{height:"11rem"}}>
            You will be required provide personal information to query the
            Mitro-Polition
            <br />
            This service will next issue a Verifiable Credential containing the
            retrieved data.
          </Card.Text>
          <Card.Link href="#">
            <Link href={`${this.props.baseUrl}vc/issue/mitro`}>
              <Button variant="primary">Next</Button>
            </Link>
          </Card.Link>
        </Card.Body>
      </Card>,
    ];

    let isRightEnabled = cards.length / 3 > this.props.cardIndex;

    let isLeftEnabled = this.props.cardIndex > 1;

    let mobileCards = (
      <Layout>
        <Row style={{ marginTop: "3rem" }}>
          <Col xs={1} style={{ marginTop: "auto", marginBottom: "auto" }}></Col>

          <Col xs={10} className={"container"}>
            <Row>
              {cards.map((card, indx) => {
                return (
                  <Col key={indx} sm={4} xs={12}>
                    {card}
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col xs={1} style={{ marginTop: "auto", marginBottom: "auto" }}></Col>
        </Row>
      </Layout>
    );

    let desktopCards = (
      <Layout>
        <Row style={{ marginTop: "3rem" }}>
          <Col xs={1} style={{ marginTop: "auto", marginBottom: "auto" }}>
            <Button
              onClick={this.decreaseCardIndex}
              variant="primary"
              disabled={!isLeftEnabled}
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} />
            </Button>
          </Col>

          <Col xs={10} className={"container"}>
            <Row>
              {cards
                .filter((card, index) => {
                  return (
                    index / 3 >= this.props.cardIndex - 1 &&
                    index / 3 < this.props.cardIndex
                  );
                })
                .map((card, indx) => {
                  return (
                    <Col key={indx} sm={4} xs={12}>
                      {card}
                    </Col>
                  );
                })}
            </Row>
          </Col>

          <Col xs={1} style={{ marginTop: "auto", marginBottom: "auto" }}>
            <Button
              onClick={this.increaseCardIndex}
              variant="primary"
              disabled={!isRightEnabled}
            >
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </Button>
          </Col>
        </Row>
      </Layout>
    );

    return isMobile() ? mobileCards : desktopCards;
  }
}

function mapStateToProps(state) {
  console.log("index.js mapping state to props");
  console.log(state);
  return {
    isFetching: state.appReducer.fetching,
    qrData: state.appReducer.qrData,
    // userEidas: state.userEidas, // the eIDAS attributes of the user
    // userEduGain: state.userEduGain, // the eduGain attributes of the user
    sessionData: state.appReducer.sessionData,
    userSelection: state.appReducer.userSelection, // the attributes selected by the user to be included in a VC,
    cardIndex: state.appReducer.cardIndex,
    baseUrl: state.appReducer.baseUrl,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    incCardIndex: () => {
      dispatch(increaseCardIndex());
    },
    decCardIndex: () => {
      dispatch(decreaseCardIndex());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
