// @ts-ignore
import tc from "turbocolor";
import { createApp } from "./create-app";
import { runInteractive } from "./interactive";
import { getStarterRepo } from "./starters";
import { cleanup, nodeVersionWarning } from "./utils";
import { getPkgVersion } from "./version";

const USAGE_DOCS = `Usage:

npm init mob-app [starter] [project-name] [github username] [github password] [github two factor code]
`;

async function run() {
  let args = process.argv.slice(2);

  const autoRun = args.indexOf("--run") >= 0;
  const help = args.indexOf("--help") >= 0 || args.indexOf("-h") >= 0;
  const info = args.indexOf("--info") >= 0;
  const username = args.indexOf("--username") || args.indexOf("-u");
  const password = args.indexOf("--password") || args.indexOf("-p");
  const otp = args.indexOf("--otp") || args.indexOf("-o");

  args = args.filter(a => a[0] !== "-");

  if (info) {
    console.log("create-mob-app:", getPkgVersion(), "\n");
    return 0;
  }
  if (help) {
    console.log(USAGE_DOCS);
    return 0;
  }

  nodeVersionWarning();

  try {
    if (args.length >= 2) {
      await createApp(
        getStarterRepo(args[0]),
        args[1],
        username >= 0 ? args[username] : "",
        password >= 0 ? args[password] : "",
        otp >= 0 ? args[otp] : "",
        autoRun
      );
    } else if (args.length < 2) {
      await runInteractive(
        args[0],
        username >= 0 ? args[username] : "",
        password >= 0 ? args[password] : "",
        otp >= 0 ? args[otp] : "",
        autoRun
      );
    } else {
      throw new Error(USAGE_DOCS);
    }
  } catch (e) {
    console.error(`\n${tc.red("✖")} ${e.message}\n`);
  }
  cleanup();
}

run();
