"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileInterceptorOptions = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
exports.uploadFileInterceptorOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: process.env.UPLOADS_DIR ?? 'uploads',
        filename: (_req, file, callback) => {
            const unique = (0, crypto_1.randomBytes)(16).toString('hex');
            callback(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
        },
    }),
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_EXTENSIONS.has((0, path_1.extname)(file.originalname).toLowerCase())) {
            callback(new common_1.BadRequestException('Only PDF, JPG, and PNG files are allowed.'), false);
            return;
        }
        callback(null, true);
    },
};
//# sourceMappingURL=multer.config.js.map