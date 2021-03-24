**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / BuildAppConfig

# Interface: BuildAppConfig

## Hierarchy

* [AppConfig](mmir_tooling.appconfig.md)

  ↳ **BuildAppConfig**

## Index

### Properties

* [configuration](mmir_tooling.buildappconfig.md#configuration)
* [directoriesTargetDir](mmir_tooling.buildappconfig.md#directoriestargetdir)
* [grammars](mmir_tooling.buildappconfig.md#grammars)
* [includeStateModelXmls](mmir_tooling.buildappconfig.md#includestatemodelxmls)
* [includeViewTemplates](mmir_tooling.buildappconfig.md#includeviewtemplates)
* [resourcesPath](mmir_tooling.buildappconfig.md#resourcespath)
* [resourcesPathOptions](mmir_tooling.buildappconfig.md#resourcespathoptions)
* [rootPath](mmir_tooling.buildappconfig.md#rootpath)
* [settings](mmir_tooling.buildappconfig.md#settings)
* [states](mmir_tooling.buildappconfig.md#states)
* [targetDir](mmir_tooling.buildappconfig.md#targetdir)
* [views](mmir_tooling.buildappconfig.md#views)

## Properties

### configuration

• `Optional` **configuration**: [RuntimeConfiguration](mmir_tooling.runtimeconfiguration.md)

*Overrides [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[configuration](mmir_webpack.webpackappconfig.md#configuration)*

`mmir` runtime configuration:
instead of, or modifying/overwriting configuration settings in `configuration.json`

NOTE only takes effect, if settings options `inlcude` (or in its sub-option) is set 'file'
(and possibly force, to enable overwriting existing files), so that settings files will be written

___

### directoriesTargetDir

• `Optional` **directoriesTargetDir**: string

directory to which the generated `directories.json` file should be written:
`directories.json` contains the listing of available mmir resources.

NOTE if this file is not in the expected location, initialization of
     `mmir` may fail during runtime, i.e. use this option with care!

**`default`** targetDir + "/gen"

___

### grammars

• `Optional` **grammars**: [GrammarBuildOptions](mmir_tooling.grammarbuildoptions.md) \| boolean

*Overrides [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[grammars](mmir_webpack.webpackappconfig.md#grammars)*

___

### includeStateModelXmls

• `Optional` **includeStateModelXmls**: boolean

if `directories.json` should include the SCXML files (`*.xml`)
e.g. for up-to-date test & runtime-compilation of state models

**`default`** true

___

### includeViewTemplates

• `Optional` **includeViewTemplates**: boolean

if `directories.json` should include the view template files (`*.ehtml`)
e.g. for up-to-date test & runtime-compilation of view templates

**`default`** true

___

### resourcesPath

• `Optional` **resourcesPath**: string

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[resourcesPath](mmir_webpack.webpackappconfig.md#resourcespath)*

specify the path to the MMIR resources directory with the default structure:
 ```bash
 config/
       /languages/
                 /<lang>/
                        /grammar.json
                        /dictionary.json
                        /speech.json
       /states/
              /input.xml
              /dialog.xml
       /configuration.json
 controllers/*
 helpers/*
 models/*
 views/*
 ```

The path will be used to collect all available resources and create the correspondig
options for including them.

**`default`** "www"

___

### resourcesPathOptions

• `Optional` **resourcesPathOptions**: [ResourcesOptions](mmir_tooling.resourcesoptions.md)

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[resourcesPathOptions](mmir_webpack.webpackappconfig.md#resourcespathoptions)*

___

### rootPath

• `Optional` **rootPath**: string

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[rootPath](mmir_webpack.webpackappconfig.md#rootpath)*

used for resolving non-absolute paths: the absolute path to the app's root/sources directory (if omitted the current working directory is used for resolving non-absolute paths)

___

### settings

• `Optional` **settings**: [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md) \| boolean

*Overrides [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[settings](mmir_webpack.webpackappconfig.md#settings)*

NOTE settings files may be written to the (settings) targetDir if
(1) the [SettingsBuildOptions.include](mmir_tooling.settingsbuildoptions.md#include) option is set to 'file'
(2) if the file already exists in the targetDir it is overwritten if the [SettingsBuildOptions.force](mmir_tooling.settingsbuildoptions.md#force) option is enabled

The `include` and `force` option can be set either in the SettingsBuildOptions, or in the specific SettingsBuildEntry/ies.

___

### states

• `Optional` **states**: [StateBuildOptions](mmir_tooling.statebuildoptions.md) \| boolean

*Overrides [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[states](mmir_webpack.webpackappconfig.md#states)*

___

### targetDir

• `Optional` **targetDir**: string

directory to which the compiled resources (and checksum files) will be stored:
for each resource type (e.g. grammar, view) a subdirectory will be created into
which the resources will be stored.

By default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** "www"

**`see`** [ResourceType](../modules/mmir_tooling.md#resourcetype)

___

### views

• `Optional` **views**: [ViewBuildOptions](mmir_tooling.viewbuildoptions.md) \| boolean

*Overrides [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[views](mmir_webpack.webpackappconfig.md#views)*
