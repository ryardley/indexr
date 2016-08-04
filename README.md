<img src="https://travis-ci.org/ryardley/indexr.svg?branch=master" />

# Indexr
Dynamic index modules for your Node or client packaged ES6 submodules.

## Background

ES6 modules are great but what if you have dynamic modules that should be autoloaded?

You can try something like this in your modules folder:

```javascript
// ./routes/index.js
export default fs
  .readdirSync(moduleFolder)
  .filter((listing) => {
    // is it a folder with an index.js? Just asking this question in node requires try catch!!
    try {
      return fs.statSync(p).isDirectory()
        && fs.statSync(path.resolve(p, 'index.js')).isFile();
    } catch (e) {
      return false;
    }
  })
  .map((listing) => {
    // sneekily require the module breaking ES6 module loading in the process...
    return require(path.resolve(moduleFolder, listing))
  });
```

This works but ES6 imports are declarative and meant for static analysis. The function `require` is actually from the commonjs API and is not part of the ES6 modules spec. Simply put ES6 modules cannot be dynamic but that doesn't stop us needing to load things simply and dynamically, does it? Assuming we have a folder full of routes modules we want to be able to do the following:

```javascript
import routes from './routes'; // folder full of 20-30 routes
import express from 'express';

const app = express();

// Apply all routes from within the routes folder
routes.map((route) => {
  app.use(route);
});

//... do other things
```

The answer has been to manually maintain a root module that exports your submodules as an array.

```javascript
// ./routes/index.js
import api from './api';
import products from './products';
import errors from './errors';
// ... import more stuff

export default [
  api,
  products,
  errors,
  // ... export more stuff
];
```

This is great because it is still statically analysable and we can import our modules as an array by simply using:

```javascript
import routes from './routes';
```

However this leads to errors if you forget to update your root module and maintainence more difficult especially if you have many modules to import.

Indexr is designed to solve this problem by automatically generating index root modules from submodules that live in your source path.

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

### Change the modules folder

We can change the glob used to find the modules folder which is useful if you don't want to have your modules under 'modules'.

```bash
$ indexr . --modules '**/modules/'
```

### Change what qualifies as a module.

We can also filter which modules and entry files we want by setting some options. the following will only include modules which contain `server.js` files.

```bash
$ indexr . --submodules '*/server.js'
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

By using the `--  direct-import` flag it will include the searched files specifically in the import statements:

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

## Help

For help with the commandline program you can try the help flag:

```bash
$ indexr --help

  Usage: indexr <rootFolder> [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -o, --out [filename]     The name of the output file. This file will be added to each module folder.
    -m, --modules [glob]     A glob pathed to the rootFolder that will determine which folders are module folders. If this is ommitted only the root folder is a module folder.
    -w, --watch [glob]       A glob pathed to the rootFolder that will determine which files to watch when in watch mode.
    -s, --submodules [glob]  A glob pathed to each module folder that will determine which submodules are imported to the index.
    -5, --es5                Use ES5 template for index output.
    -d, --direct-import      Include the searched files in the import statements.
    -i, --include [glob]     Deprecated in favour of --submodules

 Examples:

  $ indexr . --out index.r.js --modules '**/modules/' --submodules '*/index.js'
  $ indexr . --watch --es5

```

#### NOTE: All commandline globs must be enclosed in quotes!!

The following example will look in the `./app` folder for modules and identify them with the glob '*/server.js' and then write a file to `./app/server.js`.

```bash
$ indexr ./app --out 'server.js' --submodules '*/server.js'
```

```bash
$ indexr ./app --out 'server.js' --modules '**/modules/' --submodules '*/server.js'
```

### Node API signature

```javascript
indexr(folder, options)
```

| argument            | notes                     |
| ------------------- | ------------- |
| folder              | The folder to work from. |
| options             | An object containing configuration options  |

### Available options
| option      | notes                     |
| ------------- | --------------------------------------------- |
| include       | Glob or an array of globs. |
| es5           | Boolean flag to use es5 commonjs style modules over es6. This is overridden if a template function is provided |
| template      | Either a string or a function. If a string valid values are 'es5' or 'esnext'. If a template function the function should takes an array of relative module paths and output the module file as a string |
| outputFilename      | The name and path to the outputFile relative to the module folder. |
| directImport      | Include the searched files in the import statements. |

# Contributing

This documentation is pretty average and I want to improve it so if anything is unclear let me know by [submitting an issue](https://github.com/ryardley/indexr/issues)

Found a bug? [Submit an issue](https://github.com/ryardley/indexr/issues) or [submit a pull request!](https://github.com/ryardley/indexr/pulls)

# Roadmap

[Submit a feature request!](https://github.com/ryardley/indexr/issues)

- [ ] Index Sorting
- [ ] [Gulp Plugin](http://github.com/ryardley/gulp-indexr)
