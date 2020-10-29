function formatCredentialData(vcData, vcType) {
  if (vcType.toUpperCase() === "TAXIS") {
    return formatTaxisClaim(vcData);
  }

  if (vcType.toUpperCase() === "EBILL") {
    return formatEbillClaim(vcData);
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
  



export { formatCredentialData };
