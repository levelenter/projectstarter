"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    a5erFile: './framework/database/db.er.a5er',
    createdSqlFile: './framework/database/create_table.sql',
    rest_scan_dir : "./server/src/biz",
    output_client: "./client/src/generated",
    output_server: "./server/src/generated",
    hosts: {  // 最後のスラッシュは不要
        "development": { client:"http://localhost:3000", server:"http://localhost:8888" }, 
        "production": { client:"https://on-boarding.com/api", server:"https://on-boarding.com/api" }
    }, 
    timeout_page : "/timeout",
};
exports.default = config;