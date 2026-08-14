export declare const uploadFileInterceptorOptions: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (_req: unknown, file: Express.Multer.File, callback: (error: Error | null, accept: boolean) => void) => void;
};
