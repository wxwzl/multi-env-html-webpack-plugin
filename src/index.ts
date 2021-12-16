import loadEnv from "./loadEnv";
export function getEnv(mode: string, envDir?: string, prefixes?: string | string[]) {
  return loadEnv(mode, envDir, prefixes);
}
import { walkArray, walkObj } from "./utils";
import cheerio from "cheerio";
import fs from "fs";
import chalk from "chalk";
import { Compiler } from "webpack";
export interface OptionItem {
  index: string;
  outputs: Array<{
    data: Object;
    file: string;
  }>;
  parent?: string;
}
export function dealOptions(opts: Array<OptionItem>) {
  opts.forEach((element) => {
    if (!fs.existsSync(element.index)) {
      console.error(`\nthe file not exists :${element.index} `);
      return;
    }
    const content = fs.readFileSync(element.index, { encoding: "utf-8" });
    const $ = cheerio.load(content);
    walkArray(element.outputs, (output) => {
      const clone = $.root().clone();
      let globalStr = "";
      walkObj(output.data, (value, key) => {
        globalStr += `window['${key}']=${JSON.stringify(value)};`;
      });
      clone.find(element.parent || "body").prepend(`<script>${globalStr}</script>`);
      const content = clone.html();
      fs.writeFileSync(output.file, content || "");
      console.log(chalk.green(`new file outputs :${output.file}`));
    });
  });
}
// 插件输出类
export class MultiEnvHtmlWebpackPlugin {
  opts: Array<OptionItem> = [];
  constructor(opts: Array<OptionItem>) {
    this.opts = opts;
  }
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap("MultiEnvOutput", () => {
      dealOptions(this.opts);
    });
  }
}
