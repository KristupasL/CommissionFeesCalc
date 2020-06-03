"use strict";

const settings = require("./settings/settings.js");
const fs = require("fs");
const args = process.argv.slice(2);

let rawdata = fs.readFileSync(args[0]);
let data = JSON.parse(rawdata);

//Find the largest user_id integer
let largestID = Math.max.apply(
  Math,
  data.map((o) => o.user_id)
);

//Find the smallest user_id integer
let smallestID = Math.min.apply(
  Math,
  data.map((o) => o.user_id)
);

let result = [];

//Cycle to group all user transactions into one for easier proccesing
for (smallestID; smallestID <= largestID; smallestID++) {
  let currentUser = data.filter(
    (transaction) => transaction.user_id === smallestID
  );

  let weeklyLimit = 0;
  let lastTransaction;

  //All the calculations for one selected user
  currentUser.forEach((element) => {
    let fee;
    let date;

    element.lastTransaction = lastTransaction;
    element.weeklyLimit = weeklyLimit;

    //Cash In fee calculation
    if (element.type === "cash_in") {
      fee = (element.operation.amount * settings.CASH_IN.percents) / 100;

      if (fee > settings.CASH_IN.max.amount) {
        fee = settings.CASH_IN.max.amount;
      }
    }
    //Cash out fee for juridical persons calculation
    else {
      if (element.user_type === "juridical") {
        fee =
          (element.operation.amount * settings.CASH_OUT_JURIDICAL.percents) /
          100;

        if (fee < settings.CASH_OUT_JURIDICAL.min.amount) {
          fee = settings.CASH_OUT_JURIDICAL.min.amount;
        }
      }
      //Cash out fee for natural persons calculations
      else {
        date = new Date(element.date).getDay() || 7 - 1;

        if (date < lastTransaction) {
          weeklyLimit = 0;
        }

        if (weeklyLimit < 1000 && element.operation.amount > 1000) {
          fee =
            ((element.operation.amount - (1000 - weeklyLimit)) *
              settings.CASH_OUT_NATURAL.percents) /
            100;
          fee;
        } else if (weeklyLimit <= 1000 && element.operation.amount <= 1000) {
          fee = 0;
        } else {
          fee =
            (element.operation.amount * settings.CASH_OUT_NATURAL.percents) /
            100;
        }
        weeklyLimit += element.operation.amount;

        lastTransaction = new Date(element.date).getDay() || 7 - 1;
      }
    }
    let calc = {
      fee: fee,
      date: new Date(element.date),
    };
    result.push(calc);
  });
}

//Sort the fees back by date and not by user
result.sort((a, b) => (a.date > b.date ? 1 : -1));

//Print the Fees
result.forEach((el) => {
  console.log(el.fee.toFixed(2));
});
