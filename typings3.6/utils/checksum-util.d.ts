declare function checkUpToDate(jsonContent: string, checksumPath: string, targetPath: string, additionalInfo: string): Promise<boolean>;
declare const _default: {
    upToDate: typeof checkUpToDate;
    createContent: (content: string, type?: string) => string;
    getFileExt: () => string;
};
export = _default;
