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
        value="Parenthood"
        control={<Radio />}
        label="Resident at health care institution"
      />
    </RadioGroup>
  </FormControl>
);

let ParenthoodForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "5rem", marginBottom: "5rem" }}
    >
      <div className="container">
        <h4 className="row">
        Contact Details Information 
        </h4>
        
        <div className="row">
          <Field name="parenthood" component={renderCheckbox} label="Γονέας:" />
        </div>

        <div className="row">
          <Field name="custody" component={renderCheckbox} label="Κηδεμονία:" />
        </div>
         
        {makeInputElement(
          "additionalAdults",
          "Προστατευόμενοι ανήλικοι:"
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

ParenthoodForm = reduxForm({
  // a unique name for the form
  form: "ebill",
})(ParenthoodForm);

export default ParenthoodForm;
