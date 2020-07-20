import React from "react";
import { Field, reduxForm } from "redux-form";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

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

const renderCheckbox = ({ input, label }) => (
  <div > 
    <FormControlLabel
      label={label}
      control={
        <Checkbox
          checked={input.value ? true : false}
          onChange={input.onChange}
        />
      }
    />
  </div>
);

const radioButton = ({ input, ...rest }) => (
  <FormControl>
    <RadioGroup {...input} {...rest}>
      <FormControlLabel
        value="hospitalized"
        control={<Radio />}
        label="Resident at health care institution"
      />
      <FormControlLabel
        value="hospitalizedSpecific"
        control={<Radio />}
        label="Resident at mental health care institution"
      />
      <FormControlLabel
        value="monk"
        control={<Radio />}
        label="Resident at a monastery"
      />
      <FormControlLabel
        value="luxury"
        control={<Radio />}
        label="Airplane, yacht owner"
      />
       <FormControlLabel
        value="none"
        control={<Radio />}
        label="None of the above"
      />
    </RadioGroup>
  </FormControl>
);

let SelfForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "5rem", marginBottom: "5rem" }}
    >
      <div className="container">
        <h4 className="row">
          Employment Details
        </h4>

        <div className="row">
          <Field name="employed" component={renderCheckbox} label="Employed" />
        </div>
        {makeInputElement(
          "oaedid",
          "Public Employment Service identification number"
        )}
        {makeInputElement(
          "oaedDate",
          "Public Employment Service  date of registration"
        )}

        <div className="row">
          <Field name="participateFead" component={renderCheckbox} label="Participate in the FEAD program" />
        </div>
        
        {makeInputElement(
          "feadProvider",
          "FEAD provider"
        )}


      </div>


      <div className="container">
        <h4 className="row">
          Personal Details
        </h4>
        <Field name="personal" component={radioButton}>
          <Radio
            value="hospitalized"
            label="Resident at health care institution"
          />
          <Radio
            value="hospitalizedSpecific"
            label="Resident at mental health care institution"
          />
          <Radio value="monk" label="Resident at Monastery" />
          <Radio value="luxury" label="Airplane, yacht owner" />
          <Radio value="none" label="None of the above" />
        </Field>
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

SelfForm = reduxForm({
  // a unique name for the form
  form: "contact",
})(SelfForm);

export default SelfForm;
