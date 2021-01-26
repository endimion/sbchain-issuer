import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";


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
        <h4 className="row">Πληροφορίες Στοιχείων Επικοινωνίας</h4>
        {makeInputElementDisabled("name", "Όνομα", null)}
        {makeInputElementDisabled("surname", "Επώνυμο", null)}
        {makeInputElementDisabled("email", "Διεύθυνση email", null)}
        {makeInputElementDisabled("landline", "Αριθμός Σταθερού Τηλεφώνου", null)}
        {makeInputElementDisabled("mobile", "Αριθμός Κινητού Τηλεφώνου", null)}
        {makeInputElementDisabled("iban", "Αριθμός Τραπεζικού Λογαριασμού (IBAN)", null)}
        {makeInputElementDisabled("endorser", "Εmail Αρμόδιου επιβεβαίωσης*:")}
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
              {makePrinable(props.endorsed.contact)}
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
        Υποβολή
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
        <li>Διεύθυνση email: {attributes.email} </li>
        <li>Αριθμός Σταθερού Τηλεφώνου: {attributes.landline} </li>
        <li>Αριθμός Κινητού Τηλεφώνου: {attributes.mobile} </li>
        <li>Αριθμός Τραπεζικού Λογαριασμού (IBAN): {attributes.iban} </li>
      </ol>
    </div>
  );
};

EndorsedEBillForm = reduxForm({
  // a unique name for the form
  form: "contact",
})(EndorsedEBillForm);

export default connect((state) => ({
  // alternatively, you can set initial values here...
  //state.form.ebill.values..appReducer.endorsement.ebill
  initialValues: state.appReducer.endorsement.contact,
}))(EndorsedEBillForm);

// export default EndorsedEBillForm;
