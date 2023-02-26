"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    a5erFile: './database/er/db.er.a5er',
    createSqlFile: './database/init/create_table.sql',
    CLIENT_OUT_PATH: './src/frontend/biz/remote',
    framework: {
        biz: { dir: '../../../framework/biz/' },
    },
    db: {
        generate: {
            entity: './src/server/dto/generated',
            dao: './src/server/dao/generated',
        },
    },
    rest: {
        genarete: {
            path: './src/framework/web/generatedRest.ts',
            ignoreTokenFilePath: './src/framework/web/ignoreTokenUriList.ts',
        },
        service: {
            from: { router: { dir: '../../server/biz/' } },
            dir: './src/server/biz/',
            scandir: {
                dto: './src/server/dto',
                entity: './src/server/dto/generated',
                param: './src/server/param',
            },
            import: {
                dto: '../../server/dto/',
                entity: '../../server/dto/generated/',
                param: '../../server/param/',
            },
        },
        remote: {
            import: {
                dto: '../../../server/dto/',
                entity: '../../../server/dto/generated/',
                param: '../../../server/param/',
            },
        },
    },
};
exports.default = config;
//# sourceMappingURL=generator.config.js.map