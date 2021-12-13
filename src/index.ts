import loadEnv from "./loadEnv";
export function getEnv(mode:string) {
  return loadEnv(mode);
}
import { walkArray, walkObj } from "./utils";
import cheerio from "cheerio";
import fs from "fs";
import chalk from "chalk";
import { compilation, Compiler } from "webpack";
export interface OptionItem {
  index: string;
  outputs: Array<{
    data: Object;
    file: string;
  }>;
}
// 插件输出类
export class MultiEnvHtmlWebpackPlugin {
  opts: Array<OptionItem> = [];
  constructor(opts: Array<OptionItem>) {
    this.opts = opts;
  }
  apply(compiler: Compiler) {
    // 注册自定义插件钩子到生成资源到 output 目录之前，拿到compilation对象（编译好的stream）
    compiler.hooks.afterEmit.tap(
      "MultiEnvOutput",
      (compilation: compilation.Compilation) => {
        // 遍历构建产物

        this.opts.forEach((element) => {
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
            clone.find("body").prepend(`<script>${globalStr}</script>`);
            const content = clone.html();
            fs.writeFileSync(output.file, content || "");
            console.log(chalk.green(`new file outputs :${output.file}`));
          });
        });
      }
    );
  }
}
