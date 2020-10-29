import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
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

const makeInputElementDisabled = (theName, text) => {
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
          disabled={true}
        />
      </div>
    </div>
  );
};

let EndorsedEBillForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: "5rem", marginBottom: "5rem" }}
    >
      <div className="container">
        <h4 className="row">Πληροφορίες Λογαριασμού Ενέργειας</h4>

        {makeInputElementDisabled("name", "Όνομα", null)}
        {makeInputElementDisabled("surname", "Επώνυμο", null)}
        {makeInputElementDisabled("fathersName", "Πατρώνυμο", null)}
        {makeInputElementDisabled("afm", "AFM", null)}
        {makeInputElementDisabled("street", "Οδός", null)}
        {makeInputElementDisabled("number", "Αριθμός", null)}
        {makeInputElementDisabled("municipality", "Δήμος", null)}
        {makeInputElementDisabled("po", "Τ.Κ.", null)}


        <div className="form-group row">
          <label className="col-sm-2 col-form-label">
            Ιδιοκτησιακό καθεστώς
          </label>
          <div>
            <Field name="ownership" component="select" disabled={true}>
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
            <Field name="supplyType" component="select" disabled={true}>
              <option></option>
              <option value="power">DEDDIE</option>
              <option value="settlement">Settlement</option>
              <option value="noSupply">noSupply</option>
              <option value="guest">Reside as Guest</option>
              <option value="homeless">Homeless</option>
            </Field>
          </div>
        </div>

        {/* {makeInputElementDisabled("endorser", "Εmail Αρμόδιου επιβεβαίωσης*:")} */}

        {makeInputElementDisabled("meterNumber", "Μετρητής ΔΕΔΔΗΕ*:")}

        <div className="row" style={{ marginBottom: "1rem" }}>
          <div>
            <b>Έκδοση υπεύθυνης δήλωσης</b> <br />
            Παρακαλώ μεταβείτε στη{" "}
            <a href="https://dilosi.services.gov.gr/create/q/templates">
              σελιδα
            </a>{" "}
            ώστε να δημιουργήσετε υπεύθυνη δήλωση με τα κάτωθι στοιχεία ως πεδίο
            εγγράφου: <br /> <br />
            <div
              style={{
                padding: "8px 24px",
                background: "#e0e0e0",
                borderLeft: "4px solid #046ec5",
              }}
            >
              Επαλήθευσα τα στοιχεία
              {makePrinable(props.endorsed.ebill)}
              και τα βρήκα ακριβή <br /> <br />
            </div>
            Στη συνέχεια εισάγεται τον αριθμό πρωτοκόλλου της υπεύθυνης δήλωση
            στο ακόλουθο πεδίο και πατήστε υποβολή ωστε να επιβεβαιώσετε την
            ορθότητα των στοιχείων
          </div>
        </div>

        {makeInputElement("verification", "Αριθμός Υπεύθυνης Δήλωσης:")}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

let makePrinable = (attributes) => {
  return (
    <div className="row">
      <ol>
        <li>Όνομα: {attributes.name} </li>
        <li>Επώνυμο: {attributes.surname} </li>
        <li>Πατρώνυμο: {attributes.fathersName} </li>
        <li>AFM: {attributes.afm} </li>
        <li>Οδός: {attributes.street} </li>
        <li>Αριθμός: {attributes.number} </li>
        <li>Δήμος: {attributes.municipality} </li>
        <li>Τ.Κ.: {attributes.po} </li>
        <li>Ιδιοκτησιακό καθεστώς: {attributes.ownership}</li>
        <li>Παροχή: {attributes.supplyType}</li>
        <li>Μετρητής ΔΕΔΔΗΕ: {attributes.meterNumber}</li>
      </ol>
    </div>
  );
};

EndorsedEBillForm = reduxForm({
  // a unique name for the form
  form: "ebill",
})(EndorsedEBillForm);

export default connect((state) => ({
  // alternatively, you can set initial values here...
  //state.form.ebill.values..appReducer.endorsement.ebill
  initialValues: state.appReducer.endorsement.ebill,
}))(EndorsedEBillForm);

// export default EndorsedEBillForm;
