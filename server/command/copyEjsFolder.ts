/* eslint-disable @typescript-eslint/no-var-requires */
const fse = require("fs-extra");
const path = require("path");

const from = path.resolve(__dirname, "../../../src/server/ejs");
const to = path.resolve(__dirname, "../../../build/src/server/ejs");
console.log("////////////////////////");
console.log(`copy ejs start from :${from} to:${to}`);
fse.copySync(from, to);
console.log("copy ejs done");
console.log("////////////////////////");
