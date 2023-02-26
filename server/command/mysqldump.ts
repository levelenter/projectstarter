// import dayjs from "dayjs";
// import mysqldump from "mysqldump";
// import config from "config";

// const setting: any = config.get("db");

// async function main() {
//   const fileName = `./database/backup/backup${dayjs().format(
//     "YYYYMMDDHHmm"
//   )}.sql`;
//   // dump the result straight to a file
//   const result = await mysqldump({
//     connection: {
//       host: setting.host,
//       port: setting.port,
//       user: setting.user,
//       password: setting.password,
//       database: setting.database,
//     },
//     dumpToFile: fileName,
//     // compressFile: true,
//     // dump: { tables: ["deleted_data", "error_data"], excludeTables: true },
//   });

//   // fs.writeFileSync(
//   //   path.resolve(
//   //     fileName
//   //   ),
//   //   result
//   // );
//   // console.log(result);
//   console.log(fileName);
// }

// main().catch((e) => console.error(e));
