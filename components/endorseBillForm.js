import React from "react";
import { Field, reduxForm } from "redux-form";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "@material-ui/core/Select";

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
  <div>
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

let EndorseBillForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "5rem", marginBottom: "5rem" }}
    >
      <div className="container">
        <h4 className="row">Πληροφορίες Λογαριασμού Ενέργειας</h4>

        {makeInputElement("name", "Όνομα", null)}
        {makeInputElement("surname", "Επώνυμο", null)}
        {makeInputElement("fathersName", "Πατρώνυμο", null)}
        {makeInputElement("afm", "AFM", null)}
        {makeInputElement("street", "Οδός", null)}
        {makeInputElement("number", "Αριθμός", null)}
        {makeInputElement("municipality", "Δήμος", null)}
        {makeInputElement("po", "Τ.Κ.", null)}


        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Ιδιοκτησιακό καθεστώς</label>
          <div>
            <Field name="ownership" component="select">
              <option></option>
              <option value="owned">Ιδιόκτητο</option>
              <option value="rent">Ενοίκιο</option>
              <option value="free">Ελεύθερη Κατοικία</option>
              <option value="guest">Φιλοξενούμενος</option>
              <option value="homeless">Άστεγος</option>
            </Field>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Τύπος Παροχής</label>
          <div>
            <Field name="supplyType" component="select">
              <option></option>
              <option value="power">DEDDIE</option>
              <option value="settlement">Settlement</option>
              <option value="noSupply">noSupply</option>
              <option value="guest">Reside as Guest</option>
              <option value="homeless">Homeless</option>
            </Field>
          </div>
        </div>


        {makeInputElement("endorser", "Εmail Αρμόδιου επιβεβαίωσης*:")}

        {makeInputElement("meterNumber", "Μετρητής ΔΕΔΔΗΕ*:")}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

EndorseBillForm = reduxForm({
  // a unique name for the form
  form: "ebill",
})(EndorseBillForm);

export default EndorseBillForm;
