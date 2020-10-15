export declare type PackageJson = {
    [field: string]: any;
};
/** simplified interface for read-pkg-up (with backwards compatibility for result) */
export interface ReadPkgUp {
    sync({ cwd: string }: {
        cwd: any;
    }): {
        packageJson?: PackageJson;
        pkg?: PackageJson;
    };
}
/** simplified interface for semver */
export interface SemVer {
    satisfies(versionString: string, requirementString: string): boolean;
}
