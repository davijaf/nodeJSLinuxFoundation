#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import got from 'got'; // Import got

import {
  bgCyan,
  bgPurple,
  bgRed,
  bgYellow,
  txBlue,
  txCyan,
  txGreen,
  txPurple,
  txRed,
  txYellow,
} from "./colors.js";

// Defina a URL da sua API
const API = "http://localhost:3000"; // Exemplo: substitua pela URL real da sua API

// Export the output display functions
// Log the usage of the command to the console
export const log = (msg) => 
console.log(`\n${msg}\n`);

// Log the error to the console
export const error = (msg) =>
console.error(`${bgRed.inverse(`⚠️ Error:`)}\n${txRed(msg)}\n`);

// Get the current timestamp
const timestamp = () => new Date().toLocaleString();

export const displayTimestamp = () => bgPurple(timestamp());

export const displayInfo = (msg) => bgYellow.bold(`ℹ️ ${msg ?? "Info:"}`);

export const displaySuccess = (msg = "") =>
  bgCyan.inverse.bold(`✅ Success! ${msg}`);

export const displayCategory = (category) => txGreen.bold.underline(category);

export const displayAmount = (amount) => txYellow.bold.underline(`$${amount}`);

export const displayID = (id) => txCyan.bold(id);

export const displayName = (name) => txCyan(name);

export const displayRRP = (rrp) => txYellow.bold(`$${rrp}`);

export const displayText = (msg) => txPurple(msg);

export const displayKey = (key) => txBlue.bold(key);

// Update the order with the given ID
export async function update(id, amount) {
  log(`${displayTimestamp()}`);
  log(
    `${displayInfo(`Updating Order`)} ${displayID(id)} ${displayText(
      "with amount"
    )} ${displayAmount(amount)}`
  );
  try {
    if (isNaN(+amount)) {
      error("<AMOUNT> must be a number");
      process.exit(1);
    }
    // Use GOT to make a POST request to the API
    await got.post(`${API}/orders/${id}`, {
      json: { amount: +amount },
    });
    // Log the result to the console
    log(
      `${displaySuccess()} ${displayText("Order")} ${displayID(
       id
      )} ${displayText("updated with amount")} ${displayAmount(amount)}`
    );
  } catch (err) {
    // If there is an error, log it to the console and exit
    console.log(err.message);
    error(err.message); // Use a função de erro definida
    process.exit(1);
  }
}

// Configuração do Yargs
yargs(hideBin(process.argv))
  .command(
    'update <id> <amount>',
    'Update an order with a new amount',
    (yargs) => {
      return yargs
        .positional('id', {
          describe: 'Order ID',
          type: 'string',
        })
        .positional('amount', {
          describe: 'New amount for the order',
          type: 'number',
        });
    },
    async (argv) => {
      await update(argv.id, argv.amount);
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;