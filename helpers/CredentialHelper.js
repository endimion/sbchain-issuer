function formatCredentialData(vcData, vcType) {
  if (vcType.toUpperCase() === "TAXIS") {
    return formatTaxisClaim(vcData);
  }

  if (vcType.toUpperCase() === "EBILL") {
    return formatEbillClaim(vcData);
  }

  if(vcType.toUpperCase() === "CONTACT"){
    return formatContactClaim(vcData)
  }

  if(vcType.toUpperCase() === "E1"){
    return formatFinancialIDClaim(vcData)
  }


}

function formatTaxisClaim(vcData) {
  return {
    TAXIS_ID: {
      claims: {
        afm: vcData.TAXIS.TAXIS.afm,
        firstName: vcData.TAXIS.TAXIS.fistName,
        lastName: vcData.TAXIS.TAXIS.lastName,
        fathersName: vcData.TAXIS.TAXIS.fathersName,
        mothersName: vcData.TAXIS.TAXIS.mothersName,
        yearOfBirth: vcData.TAXIS.TAXIS.dateOfBirth,
      },
      metadata: {
        source: vcData.TAXIS.TAXIS.source,
        id: vcData.id,
      },
    },
  };
}

/*
{ TAXIS:
   { TAXIS:
      { fistName: 'ΕΥΤΥΧΙΑ',
        afm: '068933130   ',
        lastName: 'ΒΑΒΟΥΛΑ',
        fathersName: 'ΕΜΜΑΝΟΥΗΛ',
        mothersName: 'ΑΝΝΑ',
        dateOfBirth: '1950',
        loa: 'low',
        source: 'TAXIS' } },
  id: '19DRPJ' }


  
{ EBILL:
   { ebill:
      { ownership: 'owned',
        supplyType: 'power',
        endorser: 'triantafyllou.ni@gmail.com',
        meterNumber: '12312',
        source: 'ebill',
        loa: 'low',
        endorsement: 'pKORbUhKRrm0n7yhWD3f8A',
        id: '1CEZ2K' } } }
*/
function formatEbillClaim(vcData) {
    return {
        Electricity_Bill_ID: {
        claims: {
            name: vcData.EBILL.ebill.name,
            surname: vcData.EBILL.ebill.surname,
            father_name: vcData.EBILL.ebill.fathersName,
            afm: vcData.EBILL.ebill.fathersName,
            address: vcData.EBILL.ebill.address? {
                street: vcData.EBILL.ebill.address.street,
                number:vcData.EBILL.ebill.address.number,
                municipality:vcData.EBILL.ebill.address.municipality,
                po:vcData.EBILL.ebill.address.po,
            } :{},
            meter_number: vcData.EBILL.ebill.meterNumber,
            ownership: vcData.EBILL.ebill.ownership,
            supply_type:vcData.EBILL.ebill.supplyType,
        },
        metadata: {
          source: "endorsed",
          endorser: vcData.EBILL.ebill.endorser,
          verification: vcData.EBILL.ebill.endorsement,
          id: vcData.EBILL.ebill.id,
        },
      },
    };
  }
  
  // { Contact:
  //   { contact:
  //      { ownership: 'owned',
  //        supplyType: 'power',
  //        endorser: 'triantafyllou.ni@gmail.com',
  //        meterNumber: '12312',
  //        source: 'ebill',
  //        loa: 'low',
  //        endorsement: 'pKORbUhKRrm0n7yhWD3f8A',
  //        id: '1CEZ2K' } } }
  function formatContactClaim(vcData) {
    return {
      CONTACT_ME: {
        claims: {
          name: vcData.Contact.contact.name,
          surname: vcData.Contact.contact.surname,
          email: vcData.Contact.contact.email,
          landline: vcData.Contact.contact.landline,
          landline: vcData.Contact.contact.landline,
          mobile: vcData.Contact.contact.mobile,
          iban: vcData.Contact.contact.iban,
                    
        },
        metadata: {
          source: "endorsed",
          endorser: vcData.Contact.contact.endorser,
          verification: vcData.Contact.contact.endorsement,
          id: vcData.Contact.contact.id,
        },
      },
    };
  }


  function formatFinancialIDClaim(vcData) {
    return {
      PERSONAL_FINANCIAL_STATUS : {
        claims: {
          name: vcData.Contact.contact.name,
          surname: vcData.Contact.contact.surname,
          email: vcData.Contact.contact.email,
          landline: vcData.Contact.contact.landline,
          landline: vcData.Contact.contact.landline,
          mobile: vcData.Contact.contact.mobile,
          iban: vcData.Contact.contact.iban,
                    
        },
        metadata: {
          source: "endorsed",
          endorser: vcData.Contact.contact.endorser,
          verification: vcData.Contact.contact.endorsement,
          id: vcData.Contact.contact.id,
        },
      },
    };
  }



export { formatCredentialData };
