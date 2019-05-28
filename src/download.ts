import { get } from "https";
import { Starter } from "./starters";

export function downloadStarter(
  starter: Starter,
  username: string,
  password: string,
  factorCode: string
) {
  console.log(`starter repo: ${starter.repo}`);
  return downloadFromURL(
    `https://github.com/${starter.repo}/archive/master.zip`,
    username,
    password,
    factorCode
  );
}

function downloadFromURL(
  url: string,
  username?: string,
  password?: string,
  factorCode?: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const options =
      !username || !password || !factorCode
        ? {}
        : {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${username}:${password}`
              ).toString("Base64")}`,
              "x-github-otp": factorCode
            }
          };
    get(url, options, res => {
      if (res.statusCode === 302) {
        downloadFromURL(res.headers.location!).then(resolve, reject);
      } else {
        const data: any[] = [];

        res.on("data", chunk => data.push(chunk));
        res.on("end", () => {
          resolve(Buffer.concat(data));
        });
        res.on("error", err => {
          console.error(err);
          return reject(err);
        });
      }
    });
  });
}
