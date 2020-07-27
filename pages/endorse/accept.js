import React from "react";
import Layout from "../../components/Layout";
import { connect } from "react-redux";
import { Button, Row, Col, Card, Container } from "react-bootstrap";


class RegisterEndorser extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps({ reduxStore, req }) {
    return {}
  }


  render() {
   
      return (
        <Layout>
          <Row>
            <Col>
            Thank you for endorsing! The Credntial will be sent to the users mobile wallet!
            </Col>
          </Row>
        </Layout>
      );
  }
}

function mapStateToProps(state) {
  return {
   
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterEndorser);
