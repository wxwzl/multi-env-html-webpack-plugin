# multi-env-html-webpack-plugin

这是一个`webpack` 插件。用来生成被注入了不同`script`脚本的`html`入口文件。通常用来生成单页面应用的不同环境的入口html文件，以避免构建不同环境的应用包需要进行多次构建过程时，例如：假设需要生成`3`个环境的应用包时，原来需要执行`3`次构建命令和构建过程。利用这个插件则可以进行`1`次构建，生成不同环境的入口`index.html`文件，在部署环境时仅需指定对应环境的入口文件即可。原理就是通过改变现有项目中的`process.env`通过webpack编译后的输出结果，让它变成一个全局变量，然后在项目的入口文件的所有脚本前面注入该全局变量。

## 安装

- npm: 

`npm i multi-env-html-webpack-plugin -D`

- yarn:

`yarn add  multi-env-html-webpack-plugin -D`

- pnpm:

`pnpm add  multi-env-html-webpack-plugin -D`


## 使用


```
// webpack 配置
const { getEnv, MultiEnvHtmlWebpackPlugin } = require("multi-env-html-webpack-plugin");
const path = require("path");
const globalEnvName='_env_'
module.exports = {
  // 第一步改变process.env编译后的输出结果

  //webpack项目：
  new webpack.DefinePlugin({
    "process.env":`window.${globalEnvName}`
  })
  

  // vue-cli项目

  config.plugin("define").tap(() => {
    return [
      {
        "process.env": `window.${globalEnvName}`,
      },
    ];
  });

  ...
  // 第二部配置插件，根据环境配置输出文件路径和对应的环境变量

  plugins:[
    //单页面应用
    new MultiEnvHtmlWebpackPlugin([{
      index:"./dist/index.html",
      outputs:[
        //process.env.mode 为构建时的环境参数，为了本地开发时也采用方案提供支持,注意需确定入口文件index的路径
        //{
        //  data: { [`${globalEnvName}`]: getEnv(process.env.mode)},
        //  file: path.join(__dirname,"./dist/index.html",)
        //},
        {
          data:{
            [`${globalEnvName}`]:getEnv("production"),//加载.env.*文件或者直接自己写入对象
          },
          file:path.join(__dirname,"./dist/index-production.html")
        },
        {
          data:{
            [`${globalEnvName}`]:getEnv("dev"),
          },
          file:path.join(__dirname,"./dist/index-dev.html")
        },
        {
          data:{
            [`${globalEnvName}`]:getEnv("test"),
          },
          file:path.join(__dirname,"./dist/index-test.html")
        }
      ]
    }]),


    //多页面应用
    new MultiEnvHtmlWebpackPlugin([
      {
        index:"./dist/pc/index.html",
        outputs:[
          //process.env.mode 为构建时的环境参数，为了本地开发时也采用方案提供支持,注意需确定入口文件index的路径
          //{
          //  data: { [`${globalEnvName}`]: getEnv(process.env.mode)},
          //  file: path.join(__dirname,"./dist/index.html"),
          //}, 
          {
            data:{
              [`${globalEnvName}`]:getEnv("production"),
            },
            file:path.join(__dirname,"./dist/index-production.html")
          },
          {
            data:{
              [`${globalEnvName}`]:getEnv("dev"),
            },
            file:path.join(__dirname,"./dist/index-dev.html")
          },
        ]
      },
      {
        index:"./dist/mobile/index.html",
        outputs:[
          {
            data:{
              [`${globalEnvName}`]:getEnv("pro"),
            },
            file:path.join(__dirname,"./dist/mobile/index-pro.html")
          },
          {
            data:{
              [`${globalEnvName}`]:getEnv("dev"),
            },
            file:path.join(__dirname,"./dist/mobile/index-dev.html")
          },
        ]
      },
    ]),
  ]
}

```
