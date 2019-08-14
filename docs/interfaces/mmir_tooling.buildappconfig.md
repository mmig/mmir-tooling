> **[mmir-tooling 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [BuildAppConfig](mmir_tooling.buildappconfig.md) /

# Interface: BuildAppConfig

## Hierarchy

* [AppConfig](mmir_tooling.appconfig.md)

  * **BuildAppConfig**

## Index

### Properties

* [directoriesTargetDir](mmir_tooling.buildappconfig.md#optional-directoriestargetdir)
* [grammars](mmir_tooling.buildappconfig.md#optional-grammars)
* [includeStateModelXmls](mmir_tooling.buildappconfig.md#optional-includestatemodelxmls)
* [includeViewTemplates](mmir_tooling.buildappconfig.md#optional-includeviewtemplates)
* [resourcesPath](mmir_tooling.buildappconfig.md#optional-resourcespath)
* [resourcesPathOptions](mmir_tooling.buildappconfig.md#optional-resourcespathoptions)
* [rootPath](mmir_tooling.buildappconfig.md#optional-rootpath)
* [states](mmir_tooling.buildappconfig.md#optional-states)
* [targetDir](mmir_tooling.buildappconfig.md#optional-targetdir)
* [views](mmir_tooling.buildappconfig.md#optional-views)

## Properties

### `Optional` directoriesTargetDir

• **directoriesTargetDir**? : *string*

directory to which the generated `directories.json` file should be written:
`directories.json` contains the listing of available mmir resources.

NOTE if this file is not in the expected location, initialization of
     `mmir` may fail during runtime, i.e. use this option with care!

**`default`** targetDir + "/gen"

___

### `Optional` grammars

• **grammars**? : *[GrammarBuildOptions](mmir_tooling.grammarbuildoptions.md) | boolean*

*Overrides [AppConfig](mmir_tooling.appconfig.md).[grammars](mmir_tooling.appconfig.md#optional-grammars)*

___

### `Optional` includeStateModelXmls

• **includeStateModelXmls**? : *boolean*

if `directories.json` should include the SCXML files (`*.xml`)
e.g. for up-to-date test & runtime-compilation of state models

**`default`** true

___

### `Optional` includeViewTemplates

• **includeViewTemplates**? : *boolean*

if `directories.json` should include the view template files (`*.ehtml`)
e.g. for up-to-date test & runtime-compilation of view templates

**`default`** true

___

### `Optional` resourcesPath

• **resourcesPath**? : *string*

*Inherited from [AppConfig](mmir_tooling.appconfig.md).[resourcesPath](mmir_tooling.appconfig.md#optional-resourcespath)*

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

### `Optional` resourcesPathOptions

• **resourcesPathOptions**? : *[ResourcesOptions](mmir_tooling.resourcesoptions.md)*

*Inherited from [AppConfig](mmir_tooling.appconfig.md).[resourcesPathOptions](mmir_tooling.appconfig.md#optional-resourcespathoptions)*

___

### `Optional` rootPath

• **rootPath**? : *string*

*Inherited from [AppConfig](mmir_tooling.appconfig.md).[rootPath](mmir_tooling.appconfig.md#optional-rootpath)*

used for resolving non-absolute paths: the absolute path to the app's root/sources directory (if omitted the current working directory is used for resolving non-absolute paths)

___

### `Optional` states

• **states**? : *[StateBuildOptions](mmir_tooling.statebuildoptions.md) | boolean*

*Overrides [AppConfig](mmir_tooling.appconfig.md).[states](mmir_tooling.appconfig.md#optional-states)*

___

### `Optional` targetDir

• **targetDir**? : *string*

directory to which the compiled resources (and checksum files) will be stored:
for each resource type (e.g. grammar, view) a subdirectory will be created into
which the resources will be stored.

By default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** "www"

**`see`** [ResourceType](../modules/mmir_tooling.md#resourcetype)

___

### `Optional` views

• **views**? : *[ViewBuildOptions](mmir_tooling.viewbuildoptions.md) | boolean*

*Overrides [AppConfig](mmir_tooling.appconfig.md).[views](mmir_tooling.appconfig.md#optional-views)*