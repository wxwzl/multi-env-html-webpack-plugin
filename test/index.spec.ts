import loadEnv from "../src/loadEnv";
import { dealOptions, getEnv } from "../src/index";
import path from "path";
import fs from "fs";
// test("stringify", () => {
//   // let str = stringify({
//   //   method: function () {
//   //     console.log(111);
//   //   },
//   //   undefined: undefined,
//   //   number: 1,
//   //   string: "string",
//   //   date: new Date("2021-12-12"),
//   //   regExp: /[1-9]/g,
//   // });
//   // console.log("str:", str);
//   let globalStr = "";
//   walkObj({ _env_: { test: 1 } }, (value, key) => {
//     globalStr += `window['${key}']=${JSON.stringify(value)};`;
//   });
//   console.log(`<script>${globalStr}</script>`);
// });
const result = {
  NODE_ENV: "development",
  VUE_APP_MODE: "development",
  test: "1",
  VUE_APP_APPNAME: "test",
  VUE_APP_OPENNProgress: "1",
};
test("loadEnv", () => {
  let obj = loadEnv("development");
  expect(obj).toEqual(result);
  obj = loadEnv("development", "./");
  expect(obj).toEqual(result);
});

test("inject", () => {
  const globalEnvName = "_env_";
  const input = path.join(__dirname, "./index.html");
  const output = path.join(__dirname, "./index-development.html");
  const output_head = path.join(__dirname, "./index-head.html");
  const options = [
    {
      index: input,
      outputs: [
        {
          data: {
            [`${globalEnvName}`]: getEnv("development"),
          },
          file: output,
        },
      ],
    },
    {
      index: input,
      outputs: [
        {
          data: {
            [`${globalEnvName}`]: getEnv("development"),
          },
          file: output_head,
        },
      ],
      parent: "head",
    },
  ];
  dealOptions(options);
  expect(fs.readFileSync(output, { encoding: "utf-8" }).replace(/\n/, "")).toBe(
    `<!DOCTYPE html><html lang="en"><head></head><body><script>window['_env_']=${JSON.stringify(
      result
    )};</script><div id="app"></div></body></html>`
  );
  expect(fs.readFileSync(output_head, { encoding: "utf-8" }).replace(/\n/, "")).toBe(
    `<!DOCTYPE html><html lang="en"><head><script>window['_env_']=${JSON.stringify(
      result
    )};</script></head><body><div id="app"></div></body></html>`
  );
});
