const usStates = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "AA",
    "AE",
    "AP",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY"
];

const canProvinces = [
    "AB",
    "BC",
    "MB",
    "NB",
    "NL",
    "NS",
    "NT",
    "NU",
    "ON",
    "PE",
    "QC",
    "SK",
    "YT"
];

const ukCounties = [
    "Aberdeenshire",
    "Anglesey",
    "Angus (Forfarshire)",
    "Antrim",
    "Argyll",
    "Armagh",
    "Avon",
    "Ayrshire",
    "Banffshire",
    "Bedfordshire",
    "Berkshire",
    "Berwickshire",
    "Brecknockshire",
    "Buckinghamshire",
    "Bute",
    "Caernarfonshire",
    "Caithness",
    "Cambridgeshire",
    "Cambridgeshire and Isle of Ely",
    "Cardiganshire",
    "Carmarthenshire",
    "Cheshire",
    "City of Aberdeen",
    "City of Belfast",
    "City of Bristol",
    "City of Derry",
    "City of Dundee",
    "City of Edinburgh",
    "City of Glasgow",
    "City of London",
    "Clackmannanshire",
    "Cleveland",
    "Clwyd",
    "Cornwall",
    "Cromartyshire",
    "Cumberland",
    "Cumbria",
    "Denbighshire",
    "Derbyshire",
    "Devon",
    "Dorset",
    "Down",
    "Dumfriesshire",
    "Dunbartonshire (Dumbarton)",
    "Durham (County Durham)",
    "Dyfed",
    "East Lothian (Haddingtonshire)",
    "East Suffolk",
    "East Sussex",
    "Essex",
    "Fermanagh",
    "Fife",
    "Flintshire",
    "Glamorgan",
    "Gloucestershire",
    "Greater London",
    "Greater Manchester",
    "Gwent",
    "Gwynedd",
    "Hampshire",
    "Hereford and Worcester",
    "Herefordshire",
    "Hertfordshire",
    "Humberside",
    "Huntingdon and Peterborough",
    "Huntingdonshire",
    "Inverness-shire",
    "Isle of Ely",
    "Isle of Wight",
    "Kent",
    "Kincardineshire",
    "Kinross-shire",
    "Kirkcudbrightshire",
    "Lanarkshire",
    "Lancashire",
    "Leicestershire",
    "Lincolnshire",
    "Lincolnshire, Parts of Holland",
    "Lincolnshire, Parts of Kesteven",
    "Lincolnshire, Parts of Lindsey",
    "London",
    "Londonderry",
    "Merionethshire",
    "Merseyside",
    "Mid Glamorgan",
    "Middlesex",
    "Midlothian (County of Edinburgh)",
    "Monmouthshire",
    "Montgomeryshire",
    "Moray (Elginshire)",
    "Nairnshire",
    "Norfolk",
    "North Humberside",
    "North Yorkshire",
    "Northamptonshire",
    "Northumberland",
    "Nottinghamshire",
    "Orkney",
    "Oxfordshire",
    "Peeblesshire",
    "Pembrokeshire",
    "Perthshire",
    "Powys",
    "Radnorshire",
    "Renfrewshire",
    "Ross and Cromarty",
    "Ross-shire",
    "Roxburghshire",
    "Rutland",
    "Selkirkshire",
    "Shetland (Zetland)",
    "Shropshire",
    "Soke of Peterborough",
    "Somerset",
    "South Glamorgan",
    "South Humberside",
    "South Yorkshire",
    "Staffordshire",
    "Stirlingshire",
    "Suffolk",
    "Surrey",
    "Sussex",
    "Sutherland",
    "Tyne and Wear",
    "Tyrone",
    "Warwickshire",
    "West Glamorgan",
    "West Lothian (Linlithgowshire)",
    "West Midlands",
    "West Suffolk",
    "West Sussex",
    "West Yorkshire",
    "Westmorland",
    "Wigtownshire",
    "Wiltshire",
    "Worcestershire",
    "Wrexham",
    "Yorkshire",
    "Yorkshire, East Riding",
    "Yorkshire, North Riding",
    "Yorkshire, West Riding"
];

const commonFields = {
    addressName: {
        type: "text",
        label: "Address Name",
        placeholder: "Give a name to this addresss so you can remember it later",
        validations: [{
            type: "required"
        }]
    },
    addressLine1: {
        type: "text",
        label: "Address Line 1",
        placeholder: "address line 1",
        validations: [{
            type: "required"
        }]
    },
    addressLine2: {
        type: "text",
        label: "Address Line 2",
        placeholder: "address line 2",
        validations: []
    },
    city: {
        type: "text",
        label: "City",
        placeholder: "city",
        validations: [{
            type: "required"
        }]
    },
};

const nonUSForm = {
    id: "adressForm",
    rows: [{
        fields: [{
            name: "addressName",
            span: 12
        }]
    },
    {
        fields: [{
            name: "addressLine1",
            span: 6
        },
        {
            name: "addressLine2",
            span: 6
        }
        ]
    },
    {
        fields: [{
            name: "city",
            span: 6
        },
        {
            name: "districtOrCounty",
            span: 6
        }
        ]
    },
    {
        fields: [{
            name: "postalCode",
            span: 12
        }]
    }
    ],
    submitLabel: "Add Address"
};

const usForm = {
    id: "adressForm",
    rows: [{
        fields: [{
            name: "addressName",
            span: 12
        }]
    },
    {
        fields: [{
            name: "addressLine1",
            span: 6
        },
        {
            name: "addressLine2",
            span: 6
        }
        ]
    },
    {
        fields: [{
            name: "city",
            span: 6
        },
        {
            name: "state",
            span: 6
        }
        ]
    },
    {
        fields: [{
            name: "postalCode",
            span: 12
        }]
    }
    ],
    submitLabel: "Add Address"
};

const addressGenerator = (country) => (addressData) => {
    let addressLines = [];
    addressLines.push(addressData.addressName || "-");
    if (addressData.addressLine1) {
        addressLines.push(addressData.addressLine1);
    }
    if (addressData.addressLine2) {
        addressLines.push(addressData.addressLine2);
    }
    let province = addressData.districtOrCounty;
    if (country === "US") {
        province = addressData.state;
    }
    addressLines.push(`${addressData.city}, ${province || ""} ${addressData.postalCode}`);
    return addressLines;
}

export default {
    "US": {
        fields: {
            ...commonFields,
            state: {
                type: "select",
                label: "State",
                options: usStates,
                placeholder: "state",
                validations: [{
                    type: "required"
                }]
            },
            postalCode: {
                type: "text",
                label: "Zip / Postal Code",
                placeholder: "zip or postal code",
                validations: [{
                    type: "required"
                },
                {
                    type: "pattern",
                    value: "^[0-9]{5}(?:-[0-9]{4})?$",
                    messsage: "Zip Code is incorrect"
                }
                ]
            },
        },
        form: usForm,
        renderAddressData: addressGenerator("US"),
    },
    "CA": {
        fields: {
            ...commonFields,
            districtOrCounty: {
                type: "select",
                label: "Province",
                options: canProvinces,
                placeholder: "province",
                validations: [{
                    type: "required"
                }]
            },
            postalCode: {
                type: "text",
                label: "Zip / Postal Code",
                placeholder: "zip or postal code",
                validations: [{
                    type: "required"
                },
                {
                    type: "pattern",
                    value: "^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ]( )?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$",
                    messsage: "Postal Code is incorrect"
                }
                ]
            },
        },
        form: nonUSForm,
        renderAddressData: addressGenerator("CA")
    },
    "GB": {
        fields: {
            ...commonFields,
            districtOrCounty: {
                type: "select",
                label: "County",
                options: ukCounties,
                placeholder: "county",
                validations: [{
                    type: "required"
                }]
            },
            postalCode: {
                type: "text",
                label: "Zip / Postal Code",
                placeholder: "zip or postal code",
                validations: [{
                    type: "required"
                }]
            },
        },
        form: nonUSForm,
        renderAddressData: addressGenerator("GB")
    }
}