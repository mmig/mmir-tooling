declare const _default: {
    getMmirDir: () => string;
    dirExists: (dir: string) => boolean;
    isStandardTarget: (targetDir: string) => boolean;
    getStandardTargetSubDir: () => string;
    canCopy: (targetDir: string) => boolean;
    copyFiles: (srcDir: string, targetDir: string, force?: boolean) => Promise<void>;
};
export = _default;
