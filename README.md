<img src="https://travis-ci.org/ryardley/indexr.svg?branch=master" />
<a href="https://badge.fury.io/js/indexr"><img src="https://badge.fury.io/js/indexr.svg" /></a>

# Indexr
Dynamic index modules for your Node or client packaged ES6 submodules.

<img src="docs/images/reducer-diagram.png?1" />

## Background

Good application architecture should be modular in terms of features. A common thing to do is to unify features with 'plumbing' code to load them together into arrays so they can be manipulated by a central process.

An example might be express routes. Say you have routes organised by feature like this:

```
app/modules
 ├── auth
 ├── errors
 ├── home
 ├── product
 └── user
```

As a good engineer you would then write plumbing code that looks like this:

```javascript
/* app/modules/index.js */
import auth from './auth';
import errors from './errors';
import home from './home';
import product from './product';
import user from './user';

export default [
  auth,
  errors,
  home,
  product,
  user,
];
```

So you can then them load them to express liek this:

```javascript
/* app/index.js */
import routes from './modules';
import express from 'express';

const app = express();

// Apply all routes from within the routes folder
routes.map((route) => {
  app.use(route);
});

```

So that is all great but what if you forget to update your index all the time like I do and/or have dynamic modules that really should be autoloaded?

You can try something like this in your modules folder:

```javascript
// ./routes/index.js
export default fs
  .readdirSync(moduleFolder)
  .filter((listing) => {
    try {
      return fs.statSync(p).isDirectory()
        && fs.statSync(path.resolve(p, 'index.js')).isFile();
    } catch (e) {
      return false;
    }
  })
  .map((listing) => {
    return require(path.resolve(moduleFolder, listing))
  });
```

This works but ES6 imports are declarative and meant for static analysis. The function `require` is actually from the commonjs API and is not part of the ES6 modules spec and will eventually be deprecated. Simply put ES6 modules cannot be dynamic.

That doesn't stop us needing to load things simply and dynamically, does it?

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

## Tip
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
import foo from './foo';
import bar from './bar';
import baz from './baz';
export default [
  foo,
  bar,
  baz
];
/** End autogenerated content **/
```
## CLI Usage

For help with the commandline program you can try the help flag:

```
$ indexr --help

  Usage: indexr <rootFolder> [options]

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -5 --es5                  Use ES5 template for index output.
    -d --direct-import        Directly import files as opposed to folders.
    -e --ext <string>         Remove this extension from imports.
    -m --modules <string>     Glob string that determine which folders hold modules.
    -o --out <filename>       The name of the output file.
    -s --submodules <string>  Glob string that determine which folders are modules.
    -w --watch [string]       Files to watch as a glob string.
```

### Examples

#### NOTE: All commandline globs must be enclosed in quotes!!

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

We can also filter which modules and entry files we want by setting some options. the following will only include modules which contain `server.js` files.

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

```typescript
indexr(rootFolder:String, options?:Object):Promise
```

### Arguments

| argument            | notes                     |
| ------------------- | ------------- |
| rootFolder          | The root folder to work from. |
| options             | An object containing configuration options  |

### Available options

| option         | default | notes |
| -------------- | ------  | -----------|
| es5            | false | Boolean flag to use es5 commonjs style modules over es6. This is overridden if a template function|
| directImport   | false | Include the searched files in the import statements. |
| exts           | [] | Remove this extension from the imported files. Useful if you would prefer to import "./foo/server" instead of "./foo/server.js" |
| modules        | '\*\*/modules/' | A glob or array of globs pathed to the rootFolder that will determine which folders are module holders. If this is ommitted defaults to "**/modules/". |
| submodules     | '\*/' | A glob pathed to each module holder folder that will determine which submodules are imported to the index. Defaults to "*/index.js" |
| template       | indexrs es6 template | A template function the function should takes an array of relative module paths and output the module file as a string |
| outputFilename | 'index.r.js' | The name of the output file. This file will be added to each module folder. |
| watch          | false | Either a boolean value or a glob that represents files for chokdir to watch. |

### Example

Here is an example

```javascript
import indexr from 'indexr';
import es6 from 'indexr/dist/modules/template/es6';

indexr(__dirname, {
  es5: false,
  modules: '**/modules/',
  submodules: '*/index.js',
  directImport: true,
  exts: ['js', 'jsx'],
  outputFilename: 'index.js',
  template: es6,
  watch: false,
})
.then((err, result) => {
  console.log('Files have been indexed!');
});
```

# Contributing

Found a bug? [Submit an issue](https://github.com/ryardley/indexr/issues) or [submit a pull request!](https://github.com/ryardley/indexr/pulls)

If anything is unclear in these docs let me know by [submitting an issue](https://github.com/ryardley/indexr/issues)
