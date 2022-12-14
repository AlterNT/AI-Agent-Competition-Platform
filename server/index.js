import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import API from "./api.js";
import Database from "./database.js";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage("Usage: $0 <command> [options]")
    .command("load-test-data", "Drops database and generates test data")
    .command("drop-db", "Drops database")
    .command("tokens <file>", "generates user tokens using student ids in file")
    .option("f", {
      alias: "file",
      description: "Load file",
      type: "string",
    })
    .command(
      "admin-tokens <file>",
      "generates admin tokens using seeds in file"
    )
    .option("f", {
      alias: "file",
      description: "Load file",
      type: "string",
    })
    .help().argv;

  console.log("MAKE SURE BATCH QUERIES IS EMPTY IF CLEARING DATABASE");
  await Database.init();

  if (argv._[0] == "load-test-data") {
    await Database.loadTestData();
    process.exit(0);
  }

  if (argv._[0] == "drop-db") {
    await Database.deleteAll();
    process.exit(0);
  }

  if (argv._[0] == "tokens") {
    const tokens = await Database.generateTokensFromFile(argv.f, false);
    console.log("User Tokens Created:", tokens);
    process.exit(0);
  }

  if (argv._[0] == "admin-tokens") {
    const tokens = await Database.generateTokensFromFile(argv.f, true);
    console.log("Admin Tokens Created:", tokens);
    process.exit(0);
  }

  API.init();
}

main();
