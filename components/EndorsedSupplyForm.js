import React from "react";
import { Field, reduxForm } from "redux-form";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Select } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const makeInputElement = (theName, text, helpText) => {
  return (
    <div className="form-group row">
      <label htmlFor={theName} className="col-sm-2 col-form-label">
        {text}
      </label>
      <div className="col-sm-10">
        <Field
          name={theName}
          component="input"
          type="text"
          className="form-control"
        />
      </div>
    </div>
  );
};

let EndorsedSupplyForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "5rem", marginBottom: "5rem" }}
    >
      <div className="container">
        <h4 className="row">Electricity Bill Information</h4>

        {makeInputElement("ownership", "Ιδιοκτησιακό καθεστώς:")}
        {makeInputElement("supplyType", "Είδος Παροχής:")}
        {makeInputElement("meterNumber", "Μετρητής ΔΕΔΔΗΕ*:")}
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Select Endorser:</label>

        <div className="col-sm-2 col-form-label">
          <FormControl style={{ width: "15rem", marginBottom: "3rem" }}>
            <InputLabel id="endorser-label">Endorser</InputLabel>
            <Select
              labelId="endorser-label"
              name="endorser"
              id="endorser"
              value={props.endorserEmail}
              onChange={props.handleChange}
            >
              {props.users.map((user) => {
                return <MenuItem key= {user.email} value={user.email}>{user.email}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
      </div>
     
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

EndorsedSupplyForm = reduxForm({
  // a unique name for the form
  form: "ebill",
})(EndorsedSupplyForm);

export default EndorsedSupplyForm;
