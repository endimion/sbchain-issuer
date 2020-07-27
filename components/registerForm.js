import React from "react";
import { Field, reduxForm } from "redux-form";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
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

let RegisterForm = (props) => {
  const { error, handleSubmit } = props;
  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "5rem", marginBottom: "5rem" }}
    >
      <div className="container">
        <h4 className="row">Register As a Verifiable Credential Endorser</h4>

        {makeInputElement("email", "Email:")}
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">
            Credential Type
          </label>

          <div className="col-sm-2 col-form-label">
            <FormControl style={{ width: "15rem", marginBottom: "3rem" }}>
              <InputLabel id="vcType-label">VC Type</InputLabel>
              <Select
                labelId="vcType-label"
                name="vcType"
                id="vcType"
                value={props.vcType}
                onChange={props.handleChange}
              >
                <MenuItem value={"mobile"}>Mobile Phone</MenuItem>
                <MenuItem value={"landline"}>Landline Phone</MenuItem>
                <MenuItem value={"address"}>Address</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="form-group row">
          {error && <strong>{error}</strong>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

RegisterForm = reduxForm({
  // a unique name for the form
  form: "registerEndorserForm",
})(RegisterForm);

export default RegisterForm;
