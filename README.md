
# Indexr
<a href="https://travis-ci.org/ryardley/indexr"><img src="https://travis-ci.org/ryardley/indexr.svg?branch=master" /></a>
<a href="https://badge.fury.io/js/indexr"><img src="https://badge.fury.io/js/indexr.svg" /></a>
<a href='https://codecov.io/gh/ryardley/indexr'><img src='https://img.shields.io/codecov/c/github/ryardley/indexr.svg?maxAge=2592000&cb=20160820.3' alt='Coverage Status' /></a>
<a href='https://www.npmjs.com/package/indexr'><img src='https://img.shields.io/npm/dt/indexr.svg?maxAge=2592000' alt='Coverage Status' /></a>

Dynamic index module boilerplate creator for your Node or client packaged ES6 submodules. **Indexr** overcomes some of the limits of ES6 modules by autogenerating module index boilerplate code usually as part of a precompilation stage in your build process.

<img src="docs/images/reducer-diagram.png?1" />

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
##Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI Usage](#cli-usage)
    - [Syntax Example](#syntax-example)
    - [Change the modules folder](#change-the-modules-folder)
    - [Change the output filename](#change-the-output-filename)
    - [Change what qualifies as a module.](#change-what-qualifies-as-a-module)
    - [ES5 module output](#es5-module-output)
    - [Use named Exports.](#use-named-exports)
    - [Including the globbed files.](#including-the-globbed-files)
  - [File Watching](#file-watching)
  - [Node API](#node-api)
    - [Signature](#signature)
    - [Arguments](#arguments)
    - [Available options](#available-options)
    - [Example](#example)
- [Contributing](#contributing)
    - [Feedback?](#feedback)
    - [Found a bug?](#found-a-bug)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Background

Good application structure should be modular in terms of features. A common thing to do is to unify features with 'plumbing' code to load them together into arrays so they can be manipulated by a central process.

An example might be redux reducers. Say you have your reducers organised by feature like this:

```
app/modules
 ├── auth/reducer.js
 ├── errors/reducer.js
 ├── home/reducer.js
 ├── product/reducer.js
 └── user/reducer.js
```

You would then write plumbing code that re-exports your reducers like this:

```javascript
/* app/modules/reducers.js */
export { default as auth } from './auth/reducer';
export { default as errors } from './errors/reducer';
export { default as home } from './home/reducer';
export { default as product } from './product/reducer';
export { default as user } from './user/reducer';
```

So you can then consume them like this:

```javascript
/* app/index.js */
import { combineReducers } from 'redux'
import * as reducers from './modules/reducers'

// Apply all reducers
const reducer = combineReducers(reducers);

// Consume reducers etc.
```

There is a simiar user story around express routes but potentially using an array. 

```
app/modules
 ├── auth/routes.js
 ├── errors/routes.js
 ├── home/routes.js
 ├── product/routes.js
 └── user/routes.js
```

```javascript
/* app/modules/routes.js */
import auth from './auth/routes';
import errors from './errors/routes';
import home from './home/routes';
import product from './product/routes';
import user from './user/routes';
export default [
  auth,
  errors,
  home,
  product,
  user,
];
```

```javascript
/* app/index.js */
import express from 'express'
import routes from './modules/routes'

// Use all routes
routes.map(app.use.bind(app));

// handle error pages and setup server
```

So that is all great but what if you forget to update your index files all the time and/or have dynamic modules that really should be autoloaded? 

Frankly, I constantly find that when creating new modules in systems like this I struggle to remember to update plumbing code and then waste a larger amount of time than acceptible wondering why the new feature I am creating does not work. I have in the past seen developers do stuff like this to compensate:

```javascript
// app/modules/reducers.js
export default fs
  .readdirSync(moduleFolder)
  .filter((listing) => {
    const folder = path.resolve(moduleFolder, listing);
    const reducer = path.resolve(folder, 'reducer.js');
    try {
      return fs.statSync(folder).isDirectory()
        && fs.statSync(reducer).isFile();
    } catch (e) {
      return false;
    }
  })
  .reduce((memo, listing) => {
    const reducer = path.resolve(folder, 'reducer.js');
    return {
      ...memo,
      [listing]: require(reducer),
    };
  }, {});
```

This works but there are problems with this.

* The function `require` is actually from the commonjs API and is not part of the ES6 modules spec and will eventually be deprecated.
* The output here is non deterministic.
* You have to use `require` as there is no way by design for ES6 imports to handle non-deterministic module loading.
* You probably don't want your app to be synchronously blocking while `require` and all the `fs` methods run in a loop.
* If you try to code this asynchronously using `fs` async methods, `System` or the new `Loader` inteface the rest of your code will be in a callback which is annoying.

The main issue here is that ES6 modules [cannot be dynamic](http://stackoverflow.com/questions/30340005/importing-modules-using-es6-syntax-and-dynamic-path).

However that doesn't stop us needing or wanting to load things dynamically, does it?

**Indexr** is designed to solve this problem by automatically generating index root modules from submodules that live in your source path.

# Installation

Install globally and use indexr in the bash prompt.

```bash
npm install indexr -g
```

Install locally and use the node API or use indexr in npm scripts (recommended).

```bash
npm install indexr --save
```

**Tip**
Try adding `./node_modules/.bin` to your path for your terminal. That way you can get access to local cli programs as you enter your npm projects.

```bash
# ~/.bash_profile
...
PATH=$PATH:./node_modules/.bin
...
```

# Usage

You can use indexr as either a command-line program or a node API.

Assuming we have a folder tree like this:

```bash
./modules
 ├── bar
 ├── baz
 └── foo
```

We run this in the root:

```bash
$ indexr .
```

Within any subfolder it finds called 'modules' you will find it will create a file called `./index.r.js` that contains the following:

```javascript
/**
  This file is autogenerated by indexr.
  Check this file into source control.
  Do not edit this file.
  For more information: http://github.com/ryardley/indexr
**/
import bar from './bar';
import baz from './baz';
import foo from './foo';
export default [
  bar,
  baz,
  foo
];
/** End autogenerated content **/
```

Alternatively if we run this:

```bash
$ indexr . --named-exports
```

Within any subfolder it finds called 'modules' you will find it will create a file called `./index.r.js` that contains the following index with named exports:

```javascript
/**
  This file is autogenerated by indexr.
  Check this file into source control.
  Do not edit this file.
  For more information: http://github.com/ryardley/indexr
**/
export { default as bar } from './bar';
export { default as baz } from './baz';
export { default as foo } from './foo';
/** End autogenerated content **/
```

## CLI Usage

For help with the commandline program you can try the help flag:

```
$ indexr --help

  Usage: indexr <rootFolder> [options]

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -e --ext <string>                Remove this extension from imports.
    -o --out <filename>              The name of the output file.
    -d --direct-import               Directly import files as opposed to folders.
    -m --modules <string>            Glob string that determine which folders hold modules.
    -i --modules-ignore <string>     Glob string that determine which folders are ignored.
    -5 --es5                         Use ES5 template for index output.
    -n --named-exports               Use named exports instead of arrays.
    -s --submodules <string>         Glob string that determine what is a submodule.
    -g --submodules-ignore <string>  Glob string that determine which submodules are ignored.
    -w --watch [string]              Files to watch as a glob string.

```

### Syntax Example

**NOTE: All commandline globs must be enclosed in quotes!!**

The following example will look in the `./app` folder for modules folders identified by '**/modules/' and then identify submodules given by '*/server.js' and use them to write a file to `./app/modules/server.js`.

```bash
$ indexr ./app --out 'server.js' --modules '**/modules/' --submodules '*/server.js'
```

### Change the modules folder

We can change the glob used to find the modules folder which is useful if you don't want to have your modules under 'modules'.

```bash
$ indexr . --modules '**/features/'
```

### Change the output filename

We can change the output filename of the file indexr produces.

```bash
$ indexr . --out 'index.js'
```

### Change what qualifies as a module.

We can also filter which modules and entry files we want by setting some options. the following will only include modules which contain `reducer.js` files.

```bash
$ indexr . --submodules '*/reducer.js'
```

### ES5 module output

```bash
$ indexr . --es5
```

If the es5 flag is set Indexr can export the template in es5/common js style.

```javascript
/**
  This file is autogenerated by indexr.
  Check this file into source control.
  Do not edit this file.
  For more information: http://github.com/ryardley/indexr
**/
var foo = require('./foo');
var bar = require('./bar');
var baz = require('./baz');
module.exports = [foo, bar, baz];
/** End autogenerated content **/
```

### Use named Exports.

By using the `--named-exports` flag it will export the submodules as named exports:

```bash
$ indexr . --named-exports
```

```javascript
export { default as bar } from './bar';
export { default as baz } from './baz';
export { default as foo } from './foo';
```

### Including the globbed files.

By using the `--direct-import` flag it will include the searched files specifically in the import statements:

```bash
$ indexr . --submodules '*/server.js' --direct-import
```

```javascript
import foo from './foo/server.js';
import bar from './bar/server.js';
export default [foo, bar];
```

## File Watching

You can watch files using the `--watch` flag:

```bash
$ indexr . --watch
```


## Node API

### Signature

```ts
indexr(rootFolder:String, options?:Object):Promise
```

### Arguments

| argument            | notes                     |
| ------------------- | ------------- |
| `rootFolder`          | The root folder to work from. |
| `options`             | An object containing configuration options  |

### Available options

| option         | default | notes |
| -------------- | ------  | -----------|
| `directImport`   | `false` | Include the searched files in the import statements. |
| `es5`          | `false` | Boolean flag to use es5 commonjs style modules over es6. This is overridden if a template function|
| `exts`           | `[]` | Remove this extension from the imported files. A usefull example might be `['js']` which you would use if you would prefer to import `./foo/server` instead of `./foo/server.js` |
| `modules`        | `'\*\*/modules/'` | A glob or array of globs pathed to the rootFolder that will determine which folders are module holders. If this is ommitted defaults to `**/modules/`. |
| `modulesIgnore` | `undefined` | A glob pathed to the rootFolder that will determine which folders are not module holders. If this is ommitted nothing is ignored. |
| `namedExports`   | `false` |   This flag will ensure that indexes use named exports instead of arrays. |
| `submodules`     | `'\*/'` | A glob pathed to each module holder folder that will determine which submodules are imported to the index. Defaults to `*/index.js` |
| `submodulesIgnore` | `undefined` |  A glob pathed to the rootFolder that will determine which folders are not considered submodules. If this is ommitted nothing is ignored. |
| `template`       | indexr's es6 template | A template function the function should takes an array of relative module paths and output the module file as a string |
| `outputFilename` | `'index.r.js'` | The name of the output file. This file will be added to each module folder. |
| `watch`          | `false` | Either a boolean value or a glob that represents files for chokdir to watch. |

### Example

Here is an example

```javascript
import indexr from 'indexr';
import es6 from 'indexr/dist/modules/template/es6'; // This will change don't do this.

indexr(__dirname, {
  es5: false,
  modules: '**/modules/',
  submodules: '*/index.js',
  directImport: true,
  exts: ['js', 'jsx'],
  namedExports: false,
  outputFilename: 'index.js',
  template: es6, // or some function that takes an array of module paths and spits out a template
  watch: false,
})
.then((err, result) => {
  console.log('Files have been indexed!');
});
```

*NOTE: dont load the template from the dist file as it's location may change. This is only for illustration purposes.*

# Contributing

Start the gulp watcher.

```bash
$ gulp
```

Run the tests

```bash
$ npm run test-watch
```

Edit the code.

### Feedback?

1. [Submit an issue](https://github.com/ryardley/indexr/issues)

___

### Found a bug?

1. [Submit an issue](https://github.com/ryardley/indexr/issues)
  or
1. [Submit a pull request!](https://github.com/ryardley/indexr/pulls)

If anything is unclear or wrong in these docs please let me know by [submitting an issue](https://github.com/ryardley/indexr/issues)


