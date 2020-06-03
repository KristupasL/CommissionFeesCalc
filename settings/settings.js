const CASH_IN = {
  percents: 0.03,
  max: {
    amount: 5,
    currency: "EUR",
  },
};

const CASH_OUT_NATURAL = {
  percents: 0.3,
  week_limit: {
    amount: 1000,
    currency: "EUR",
  },
};

const CASH_OUT_JURIDICAL = {
  percents: 0.3,
  min: {
    amount: 0.5,
    currency: "EUR",
  },
};

module.exports = {
  CASH_IN,
  CASH_OUT_JURIDICAL,
  CASH_OUT_NATURAL,
};
