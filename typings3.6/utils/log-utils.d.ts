declare const _default: {
    log: (_message?: any, ..._optionalParams: any[]) => void;
    warn: (_message?: any, ..._optionalParams: any[]) => void;
    setLog(func: (_message?: any, ..._optionalParams: any[]) => void): void;
    setWarn(func: (_message?: any, ..._optionalParams: any[]) => void): void;
    setIsLog(func: () => boolean): void;
    setIsWarn(func: () => boolean): void;
};
export = _default;
