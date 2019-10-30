const path = require("path");
const pkgPath = path.resolve(`webpack-cli/package.json`);
const pkg = require(pkgPath);
debugger
require(path.resolve(
		path.dirname(pkgPath),
        './bin/cli.js'
		//pkg.bin['webpack-cli']
));

// 在命令窗口执行npx webpack时 会进行如下操作
// - 首先会找到C:\vipdata\vipproject\webpack-source\node_modules.bin\webpack.cmd
// - 里面的文件会执行 node %~dp0\..\_webpack@4.39.3@webpack\bin\webpack.js" -> node webpak.js
// - webpack.js里的核心就是上面的代码，会找到webpack-cli/bin/cli.js文件执行