declare const _default: {
    getMmirDir: () => string;
    dirExists: (dir: any) => boolean;
    isStandardTarget: (targetDir: any) => boolean;
    getStandardTargetSubDir: () => string;
    canCopy: (targetDir: any) => true | 0;
    copyFiles: (srcDir: any, targetDir: any, force: any) => Promise<void>;
};
export = _default;
