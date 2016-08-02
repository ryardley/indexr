# indexr
A tool for dynamically creating indexes modules for your ES6 submodules.

ES6 modules are great but they have the problem that they have the requirement they must be able to statically resolve their dependencies. What if you have dynamic modules that should be autoloaded?

The answer has been to manually maintain a root module that exports your submodules as an array. This leads to errors as you forget to update your root module and effectively have undry code.

Indexr is designed to solve this problem by automatically generating index root modules from submodules.

Assuming we have a folder tree like this:

```bash
/path/to/folder
         ├── bar
         ├── baz
         └── foo
```

If we run this in a node file somewhere:

```javascript
import indexr from 'indexr';
indexr('/path/to/folder', 'index.js');
```

It will create a file called `/path/to/folder/index.js` that contains the following:

```javascript
import foo from './foo';
import bar from './bar';
import baz from './baz';
export default [foo, bar, baz];
```

If the es5 flag is set Indexr can export the template in es5/common js style.

```javascript
var foo = require('./foo');
var bar = require('./bar');
var baz = require('./baz');
module.exports = [foo, bar, baz];
```

We can also filter which modules and entry files we want by setting some options.

```javascript
indexr('/path/to/folder', 'index.js', {
  include: '*/server.js',
});
```

This will only include modules which contain `server.js` files.

```javascript
indexr('/path/to/folder', 'index.js', {
  include: '*/server.js',
  exclude: '*/index.js',
  directImport: true,
  exts: ['js']
});
```

By using the `directImport` flag it will include the searched files in the import statements:

```javascript
import foo from './foo/server';
import bar from './bar/server';
export default [foo, bar];
```

# Installation

<!-- Install globally and refer to indexr from the bash prompt.

```bash
npm install indexr -g
```
 -->
Install locally and use the node API <!--or use indexr in npm scripts.-->

```bash
npm install indexr --save
```
<!--
If #2, add `./node_modules/.bin` to your path (recommended). This method means you have access to the binaries for all local npm modules.

```bash
# add node modules .bin folder for local executables
PATH=$PATH:./node_modules/.bin
``` -->

# Usage

Node API signature

```javascript
indexr(folder, [outputFile,] options)
```

| argument            | notes                     |
| ------------------- | ------------- |
| folder              | The folder to analyze |
| outputFile (opt)    | The name and path to the outputFile relative to the folder. If not included indexr will simply return a string with the file index instead of writing it to a file. |
| options             | An object containing configuration options  |

### Available options
| option      | notes                     |
| ------------- | --------------------------------------------- |
| include       | Glob or an array of globs. |
| es5           | Boolean flag to use es5 commonjs style modules over es6. This is overridden if a template function is provided |
| template      | Either a string or a function. If a string valid values are 'es5' or 'esnext'. If a template function the function should takes an array of relative module paths and output the module file as a string |


### Include
`include` can be a glob string or an array of globs. The following will index any module in the `/app` folder that contains a `server.js` file or an `index.js` file.

```javascript
indexr('/app', 'server.js', {
  include: ['*/server.js', '*/index.js']
});
```

## Node API example

```javascript
import indexr from 'indexr';

indexr('./app', 'server-index.js', {filter: ['./*/server.js']})
```
<!--
CLI Signature

```bash
indexr <folder> [--filename <filename>] [--glob <glob>]
```
CLI Example

```bash
indexr ./app --filename server-index.js --glob ./*/server.js
```

...this is a work in progress appologies more docs coming soon


 -->
