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
        label="Φιλοξενείστε ή Περιθάλπεστε σε μονάδα κλειστής φροντίδας ή σε στέγη υποστηριζόμενης διαβίωσης;"
      />
      <FormControlLabel
        value="hospitalizedSpecific"
        control={<Radio />}
        label="Φιλοξενείστε σε μονάδα ψυχοκοινωνικής αποκατάστασης;"
      />
      <FormControlLabel
        value="monk"
        control={<Radio />}
        label="Φιλοξενείστε σε Μονές;"
      />
      <FormControlLabel
        value="luxury"
        control={<Radio />}
        label="Εμπίπτετε στα κριτήρια Πολυτελή Διαβίωσης;"
      />
       <FormControlLabel
        value="none"
        control={<Radio />}
        label="Κανένα από τα παραπάνω;"
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
          Στοιχεία Επαγγελματικής Κατάστασης
        </h4>

        <div className="row">
          <Field name="employed" component={renderCheckbox} label="Εργάζεστε;" />
        </div>
        {makeInputElement(
          "oaedid",
          "Αριθμός ΟΑΕΔ"
        )}
        {makeInputElement(
          "oaedDate",
          "Ημερομηνία Εγγραφής στον ΟΑΕΔ (π.χ. 01/01/2020)"
        )}

        <div className="row">
          <Field name="participateFead" component={renderCheckbox} label="Συμμετοχή στο ΤΕΒΑ;" />
        </div>
        
        {makeInputElement(
          "feadProvider",
          "Πάροχος ΤΕΒΑ"
        )}


      </div>


      <div className="container">
        <h4 className="row">
          Προσωπικά στοιχεία
        </h4>
        <Field name="personal" component={radioButton}>
          <Radio
            value="hospitalized"
            label="Φιλοξενείστε ή Περιθάλπεστε σε μονάδα κλειστής φροντίδας ή σε στέγη υποστηριζόμενης διαβίωσης;"
          />
          <Radio
            value="hospitalizedSpecific"
            label="Φιλοξενείστε σε μονάδα ψυχοκοινωνικής αποκατάστασης;"
          />
          <Radio value="monk" label="Φιλοξενείστε σε Μονές;" />
          <Radio value="luxury" label="Πολυτελή Διαβίωση;" />
          <Radio value="none" label="Κανένα από τα παραπάνω;" />
        </Field>
      </div>

      <button type="submit" className="btn btn-primary">
        Υποβολή
      </button>
    </form>
  );
};

SelfForm = reduxForm({
  // a unique name for the form
  form: "contact",
})(SelfForm);

export default SelfForm;
