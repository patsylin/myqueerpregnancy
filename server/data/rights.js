// server/data/rights.js (CommonJS)

const STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
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
  "WY",
  "DC",
  "PR",
];

const RIGHTS = {
  CA: {
    lastUpdated: new Date().toISOString(),
    parentage_summary:
      "LGBTQ+ parentage generally protected; confirm local court procedure for confirmatory adoption.",
    abortion_summary:
      "Access protected under state law; check local provider availability.",
    links: [],
  },
  TX: {
    lastUpdated: new Date().toISOString(),
    parentage_summary:
      "Confirmatory adoption strongly recommended; procedures vary by county.",
    abortion_summary:
      "Access highly restricted; review current legal guidance and travel options.",
    links: [],
  },
};

module.exports = { STATES, RIGHTS };
