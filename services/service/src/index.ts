import * as mongoose from "mongoose";
import { retrieveData } from "./retrieveData";
import CurrencyModel from "./schema/mongoose-currency.schema";

// [DB Connection]

declare var MONGODB_URI: string;

/**
 * connectToDatabase
 * Configures the global MongoDB connection based on the provided secrets.
 *
 * @returns Promise<string>
 */
async function connectToDatabase(connectionUri: string) {
  return new Promise((resolve, reject) => {
    // From mongoose@6.x.x onwards useNewUrlParser, useUnifiedTopology,
    // useCreateIndex are deprecated and default to true
    mongoose
      .connect(connectionUri)
      .then(() => resolve(connectionUri))
      .catch((error: any) => {
        console.log(error);
        reject(`${connectionUri}: ${error}`);
      });
  });
}

// [Script execution]
connectToDatabase(MONGODB_URI)
  .then(()=> {
    // Only fetch data for a subscribed currency
    CurrencyModel.find({
      hasSubscription: true,
    })
      .then(item => {
        // Determine the currency code to update
        var currencyCode, mongooseDocument, earliestTime = 0, updateFlag= true;
        const len = item.length;
        for (var i = 0; i < len; ++i) {
          const currencyData = item[i];
          // Give priority to the ones that have no prior data
          if (typeof currencyData.forex === "undefined" || currencyData.forex === "{}") {
            mongooseDocument = item[i];
            currencyCode = currencyData.code;
            updateFlag= false;
            break;
          }
          // Otherwise, update the oldest record
          const timestamp = Date.parse(currencyData.updatedAt);
          if (timestamp < earliestTime || earliestTime === 0) {
            mongooseDocument = item[i];
            currencyCode = currencyData.code;
            earliestTime = timestamp;
          }
        }
        if (typeof currencyCode === "undefined") {
          console.log("No currency found, exiting process...");
          process.exit(0);
        } else {
          console.log("Fetching Forex data for " + currencyCode + " to EUR...");
          // Get the currency data from external API
          retrieveData(currencyCode,(retrievedData) => {
            if (updateFlag === true) {
              console.log("Updating");
              try {
                var oldForex = JSON.parse(mongooseDocument.forex);
                const newForex = JSON.parse(retrievedData);
                oldForex["Meta Data"] = newForex["Meta Data"];
                const newForexData = newForex["Time Series FX (Daily)"];
                for (const key in newForexData) {
                  // Append new dates to accumulate historic data over time
                  oldForex["Time Series FX (Daily)"][key] = newForexData[key];
                }
                mongooseDocument.forex = JSON.stringify(oldForex);
	      } catch (e) {
                console.log("Error updating Forex data: " + e);
                process.exit(0);
              }
            } else {
              mongooseDocument.forex = retrievedData;
            }
            mongooseDocument.save()
              .then(item => {
                console.log("Database save success");
                process.exit(0);
              })
              .catch(err => {
                console.log("Error on database save: " + err);
                process.exit(0);
              });
          })
        }
      })
      .catch(err => {
        console.log("Error on database find: " + err);
        process.exit(0);
      });
  });
