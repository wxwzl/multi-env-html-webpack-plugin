import { walkObj } from "../src/utils";
test("stringify", () => {
  // let str = stringify({
  //   method: function () {
  //     console.log(111);
  //   },
  //   undefined: undefined,
  //   number: 1,
  //   string: "string",
  //   date: new Date("2021-12-12"),
  //   regExp: /[1-9]/g,
  // });
  // console.log("str:", str);
  let globalStr = "";
  walkObj({ _env_: { test: 1 } }, (value, key) => {
    globalStr += `window['${key}']=${JSON.stringify(value)};`;
  });
  console.log(`<script>${globalStr}</script>`);
});
