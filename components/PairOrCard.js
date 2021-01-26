import QrPrompt from "./QrPrompt";
import SSE from "./Sse.js";

const PairOrCard = (props) => {
  let unAuthorizedIssuance = (
    <div className={"row"}>
      <div
        className={"col"}
        style={{
          marginTop: "3rem",
          marginBottom: "3rem",
          textAlign: "center",
        }}
      >
        You are not authorized to receive such a Credential
      </div>
    </div>
  );

  let vcSentToUser = (
    <div className={"row"}>
      <div
        className={"col"}
        style={{
          marginTop: "3rem",
          marginBottom: "3rem",
          textAlign: "center",
        }}
      >
        <img
          alt=""
          src="/finished.png"
          style={{
            maxWidth: "15rem",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <p>
          Η ταυτότητα στάλθηκε στο κινητό σας με επιτυχία!
          <br />
          Σε μικρό χρονικό διάστημα θα λάβετε ειδοποίηση στην εφαρμογή uPort, ώστε να την αποδεχτείτε
        </p>
      </div>
    </div>
  );

  if (props.vcSent) {
    return vcSentToUser;
  }

  if (props.unauthorized){
    return unAuthorizedIssuance;
  }

  if (props.qrData && !props.DID) {
    let sseEndpoint = props.baseUrl
      ? `${props.endpoint}/${props.baseUrl}`
      : props.endpoint;
    return (
      <div>
        <QrPrompt
          qrData={props.qrData}
          message={
            "Η υπηρεσία SBChain VC Issuer, χρειάζεται τα ακόλουθα στοιχεία από το κινητό σας:"
          }
          permissions={["Ενεργοποίηση Ειδοποιήσεων Push"]}
          baseUrl={props.baseUrl}
        />
        <SSE
          uuid={props.uuid}
          endpoint={sseEndpoint}
          serverSessionId={props.serverSessionId}
          sealSession={props.sealSession}
        />
      </div>
    );
  } else {
    if (props.DID) {
      if (props.selfForm && !props.formDataUploaded) {
        return props.selfForm;
      }

      return props.card;
    } else {
      return <div>Δημιουργία αιτήματος σύνδεσης...</div>;
    }
  }
};

export default PairOrCard;
