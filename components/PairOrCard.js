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
          The verifiable credential has been sent to your mobile phone
          succesfully!
          <br />
          You should receive a notification, prompting you to store it, very
          soon. Please check your wallet notifications
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
            "Social Solidarity Income Issuer Service is requesting to connect your uPort wallet:"
          }
          permissions={["Push Notifications"]}
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
      return <div>Generating Wallet Pairing Request...</div>;
    }
  }
};

export default PairOrCard;
