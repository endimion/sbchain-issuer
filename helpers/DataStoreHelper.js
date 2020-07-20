//TODO, handle multiple values???
function findAttributeByFriendlyName(attributeArray, attrName) {
  let result = attributeArray.find(cd => {
    return cd.friendlyName === attrName;
  });
  return result ? result.values[0] : null;
}

function makeUserDetails(dataStore) {
  const response = {};

  console.log(`DataStoreHelper --- makeUserDetails::`)
  console.log(dataStore)

  let eIDASDataSet = dataStore.clearData.find(cd => {
    return cd.type === "eIDAS";
  });

  let eduGAINSet = dataStore.clearData.find(cd => {
    return cd.type === "eduGAIN";
  });

  if (eIDASDataSet) {
    const eIDASData = eIDASDataSet.attributes;
    console.log(`Datastore helpter -- makeuserdetails-- eidasData`)
    console.log(eIDASData);
    const eIDASUserDetails = {
      given_name: findAttributeByFriendlyName(eIDASData, "GivenName"),
      family_name: findAttributeByFriendlyName(eIDASData, "FamilyName"),
      person_identifier: findAttributeByFriendlyName(
        eIDASData,
        "PersonIdentifier"
      ),
      date_of_birth: findAttributeByFriendlyName(eIDASData, "DateOfBirth"),
      source: "eidas",
      loa: eIDASData.find(attr => {
        return attr.friendlyName === "loa";
      })
        ? eIDASData.find(attr => {
            return attr.friendlyName === "loa";
          }).values
        : "low"
    };
    response.eidas = eIDASUserDetails;
  }

  

  return response;
}

export { makeUserDetails };
