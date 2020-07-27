import { Button } from "react-bootstrap";
import React from "react";
import { connect } from "react-redux";
import { setUsers,makeAndPushVC } from "../store";
import axios from "axios";


class ActiaveEndorserButton extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.session = props.session;
    this.click = this.click.bind(this);
    this.state = {active: props.active};

  }

  componentDidMount() {}

  click() {
    console.log(`clicked email ${this.props.email} and status was ${this.props.active}`)
    const theUsers = this.props.users;
    
    axios
    .post("/activate", {
      email: this.props.email
    }).then(resp =>{
      if(resp.data === "OK"){
        let newUsers = theUsers;
        console.log(newUsers);
        newUsers.forEach(element => {
          if(element.email === this.props.email){
            element.status= !element.status;
          }
        });
        this.props.setTheUsers(newUsers);
        // this.props.active= !this.props.active
        this.setState({
          active: !this.state.active
        });
      }else{
        console.log(`error occured response is `)
        console.log(resp)
      }
    })
  }

  render() {
    if (this.state.active) {
      return (
        <Button
          variant="primary"
          onClick={this.click}
        >
          Deactivate
        </Button>
      );
    } else {
      return (
        <Button
          variant="primary"
          onClick={this.click}
        >
          Activate
        </Button>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    status: state.sessionStatus,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendVC: (url, userSelection, vcType, uuid, isMobile) => {
      dispatch(makeAndPushVC(url, userSelection, vcType, uuid, isMobile));
    },

    setTheUsers: (users) => {
      dispatch(setUsers(users));
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiaveEndorserButton);
