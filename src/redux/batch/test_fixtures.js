export const pricingData = {
  buyBoxPrices: [
    {
      BuyBoxPrice: [
        {
          LandedPrice: [
            {
              CurrencyCode: "USD"
            },
            {
              Amount: "12.93"
            }
          ]
        },
        {
          ListingPrice: [
            {
              CurrencyCode: "USD"
            },
            {
              Amount: "8.95"
            }
          ]
        },
        {
          Shipping: [
            {
              CurrencyCode: "USD"
            },
            {
              Amount: "3.98"
            }
          ]
        }
      ],
      condition: "New"
    },
    {
      BuyBoxPrice: [
        {
          LandedPrice: [
            {
              CurrencyCode: "USD"
            },
            {
              Amount: "7.25"
            }
          ]
        },
        {
          ListingPrice: [
            {
              CurrencyCode: "USD"
            },
            {
              Amount: "3.27"
            }
          ]
        },
        {
          Shipping: [
            {
              CurrencyCode: "USD"
            },
            {
              Amount: "3.98"
            }
          ]
        }
      ],
      condition: "Used"
    }
  ],
  timeOfOfferChange: "2019-01-06T05:22:35.917Z",
  itemCondition: "New",
  marketplaceId: "ATVPDKIKX0DER",
  totalOfferCount: "43",
  competitive_pricing: {
    B002N2XI3E: {
      used_buy_box: {
        shipping_price_currency: "USD",
        landed_price: "7.25",
        landed_price_currency: "USD",
        listing_price: "3.27",
        listing_price_currency: "USD",
        shipping_price: "3.98"
      },
      new_buy_box: {
        shipping_price_currency: "USD",
        landed_price: "12.93",
        landed_price_currency: "USD",
        listing_price: "8.95",
        listing_price_currency: "USD",
        shipping_price: "3.98"
      }
    }
  },
  fees: [
    {
      feeCurrencyCode: "USD",
      feeAmount: "0.00",
      feeType: "ReferralFee"
    },
    {
      feeCurrencyCode: "USD",
      feeAmount: "1.80",
      feeType: "VariableClosingFee"
    },
    {
      feeCurrencyCode: "USD",
      feeAmount: "0.99",
      feeType: "PerItemFee"
    },
    {
      feeCurrencyCode: "USD",
      feeAmount: "2.41",
      feeType: "FBAFees"
    }
  ],
  numberOfOffers: [
    {
      OfferCount: "28",
      fulfillmentChannel: "Merchant",
      condition: "used"
    },
    {
      OfferCount: "15",
      fulfillmentChannel: "Merchant",
      condition: "new"
    }
  ],
  feeCurrencyCode: "USD",
  error: null,
  listPrice: [
    {
      CurrencyCode: "USD"
    },
    {
      Amount: "9.99"
    }
  ],
  buyBoxEligibleOffers: [
    {
      OfferCount: "10",
      fulfillmentChannel: "Merchant",
      condition: "used"
    },
    {
      OfferCount: "6",
      fulfillmentChannel: "Merchant",
      condition: "new"
    }
  ],
  offers: [],
  totalFeeEstimate: "5.20"
};

export const searchResult = {
  ASIN: "B002N2XI3E",
  category: "Book",
  binding: "Paperback",
  name: "Grossology",
  packageDimensions: {
    Width: "8.799999991024000",
    Length: "8.799999991024000",
    Height: "0.099999999898000",
    Weight: "0.15"
  },
  imageUrl: "http://ecx.images-amazon.com/images/I/6197YA35NGL._SL75_.jpg",
  replenishableListings: [],
  salesrank: "5642714",
  prepInstructions: "No Prep Required",
  itemDimensions: {
    Width: "0.25",
    Length: "9.04",
    Height: "9.08",
    Weight: "0.6591821633800"
  }
};

export const existingProducts = [
  {
    asin: "B002N2XI3E"
  }
];

export const batchListingDefaults = {
  shouldUseCustomSkuTemplate: false,
  skuPrefix: "testthelive12313131",
  skuNumber: 7,
  buyCost: 0.8,
  supplier: "",
  datePurchased: "",
  expDate: "",
  price: "",
  qty: 1,
  condition: "UsedLikeNew",
  note: "",
  taxCode: "A_GEN_NOTAX",
  minPrice: 0.2,
  maxPrice: 80,
  noteCategory: "All Categories",
  noteSubcategory: "All Subcategories",
  shippingTemplate: "",
  listPriceRuleType: "match_buy_box_price",
  listPriceRuleAmount: null,
  priceRuleType: null,
  priceRuleDirection: null,
  pricingOptions: false,
  gradingOptions: false,
  keepaDateRange: 31,
  defaultListPrice: 12
};

export const currentWorkingListingData = {
  shouldUseCustomSkuTemplate: false,
  skuPrefix: "testthelive12313131",
  skuNumber: 7,
  buyCost: 0.8,
  supplier: "",
  datePurchased: "",
  expDate: "",
  price: 7.25,
  qty: 1,
  condition: "UsedLikeNew",
  note: "",
  taxCode: "A_GEN_NOTAX",
  minPrice: 0.2,
  maxPrice: 80,
  shippingTemplate: "",
  keepaDateRange: 31,
  asin: "B002N2XI3E",
  imageUrl: "http://ecx.images-amazon.com/images/I/6197YA35NGL._SL75_.jpg",
  salesrank: 5642714,
  prepInstructions: "No Prep Required",
  name: "Grossology",
  itemWeight: 0.65918216338,
  packageWeight: 0.15,
  pricingData: pricingData,
  totalFeeEstimate: 5.2,
  sku: "testthelive12313131-007",
  isGeneratedSku: true,
  inboundShipmentPlans: [
    {
      Items: {
        member: {
          FulfillmentNetworkSKU: {
            value: "X0020CQXNZ"
          },
          SellerSKU: {
            value: "testthelive12313131-007"
          },
          Quantity: {
            value: "1"
          },
          value: "\n            "
        },
        value: "\n          "
      },
      DestinationFulfillmentCenterId: {
        value: "EWR4"
      },
      ShipToAddress: {
        City: {
          value: "Robbinsville"
        },
        AddressLine1: {
          value: "50 New Canton Way"
        },
        Name: {
          value: "Amazon.com.DEDC LLC"
        },
        StateOrProvinceCode: {
          value: "NJ"
        },
        value: "\n          ",
        PostalCode: {
          value: "08691-2350"
        },
        CountryCode: {
          value: "US"
        }
      },
      LabelPrepType: {
        value: "SELLER_LABEL"
      },
      ShipmentId: {
        value: "FBA15FRMX0PP"
      },
      value: "\n        ",
      EstimatedBoxContentsFee: {
        TotalUnits: {
          value: "1"
        },
        TotalFee: {
          CurrencyCode: {
            value: "USD"
          },
          Value: {
            value: "0.10"
          },
          value: "\n            "
        },
        FeePerUnit: {
          CurrencyCode: {
            value: "USD"
          },
          Value: {
            value: "0.10"
          },
          value: "\n            "
        },
        value: "\n          "
      }
    }
  ]
};
