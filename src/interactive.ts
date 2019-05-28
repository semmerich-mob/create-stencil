// @ts-ignore
import { cursor, erase } from "sisteransi";
import tc from "turbocolor";
import { createApp, prepareStarter } from "./create-app";
import { STARTERS, Starter, getStarterRepo } from "./starters";
import { prompt } from "./vendor/prompts";

export async function runInteractive(
  starterName: string | undefined,
  username: string | undefined,
  password: string | undefined,
  factorCode: string | undefined,
  autoRun: boolean
) {
  process.stdout.write(erase.screen);
  process.stdout.write(cursor.to(0, 1));

  if (!username || username === "") {
    username = await askUserName();
  }
  if (!password || password === "") {
    password = await askPassword();
  }

  if (!factorCode || factorCode === "") {
    factorCode = await ask2FactorCode();
  }

  // Get starter's repo
  if (!starterName) {
    starterName = await askStarterName();
  }
  const starter = getStarterRepo(starterName);

  // start downloading in the background
  prepareStarter(starter, username, password, factorCode);

  // Get project name
  const projectName = await askProjectName();

  // Ask for confirmation
  const confirm = await askConfirm(starter, projectName);
  if (confirm) {
    await createApp(
      starter,
      projectName,
      username,
      password,
      factorCode,
      autoRun
    );
  } else {
    console.log("\n  aborting...");
  }
}
async function askPassword(): Promise<string> {
  const { password } = await prompt([
    {
      type: "text",
      name: "password",
      message: "Password"
    }
  ]);
  if (!password) {
    throw new Error(`No password was provided, try again.`);
  }
  return password;
}
async function ask2FactorCode(): Promise<string> {
  const { factorCode } = await prompt([
    {
      type: "text",
      name: "factorCode",
      message: "2 Factor Code"
    }
  ]);
  if (!factorCode) {
    throw new Error(`No 2 factor code was provided, try again.`);
  }
  return factorCode;
}
async function askUserName(): Promise<string> {
  const { username } = await prompt([
    {
      type: "text",
      name: "username",
      message: "Username"
    }
  ]);
  if (!username) {
    throw new Error(`No username was provided, try again.`);
  }
  return username;
}
async function askStarterName(): Promise<string> {
  const { starterName } = await prompt([
    {
      type: "select",
      name: "starterName",
      message: "Pick a starter",
      choices: getChoices()
    },
    {
      type: (prev: any) => (prev === null ? "text" : null),
      name: "starterName",
      message: "Type a custom starter"
    }
  ]);
  if (!starterName) {
    throw new Error(`No starter was provided, try again.`);
  }
  return starterName;
}

function getChoices() {
  const maxLength = Math.max(...STARTERS.map(s => s.name.length)) + 1;
  return [
    ...STARTERS.filter(s => s.hidden !== true).map(s => {
      const description = s.description ? tc.dim(s.description) : "";
      return {
        title: `${padEnd(s.name, maxLength)}   ${description}`,
        value: s.name
      };
    })
  ];
}

async function askProjectName() {
  const { projectName } = await prompt([
    {
      type: "text",
      name: "projectName",
      message: "Project name"
    }
  ]);
  if (!projectName) {
    throw new Error(`No project name was provided, try again.`);
  }
  return projectName;
}

async function askConfirm(starter: Starter, projectName: string) {
  const { confirm } = await prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Confirm?"
    }
  ]);
  return confirm;
}

function padEnd(str: string, targetLength: number, padString = " ") {
  targetLength = targetLength >> 0;
  if (str.length > targetLength) {
    return str;
  }

  targetLength = targetLength - str.length;
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length);
  }

  return String(str) + padString.slice(0, targetLength);
}
