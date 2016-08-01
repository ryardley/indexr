# indexr
A tool for dynamically creating indexes modules for your ES6 submodules.

ES6 modules are great but they have the problem that they have the requirement they must be able to statically resolve their dependencies. What if you have dynamic modules that should be autoloaded?

The answer has been to manually maintain a root module that exports your submodules as an array. This leads to errors as you forget to update your root module and effectively have undry code.

Indexr is designed to solve this problem by automatically generating index root modules from submodules.

# Installation

Install globally.

```bash
npm install indexr -g
```

Or install locally.

```bash
npm install indexr --save
```

# Usage

Node API signature

```javascript
indexr(folder, [outputFile], options)
```

| argument      | notes                     |
| ------------- | ------------- |
| folder        | The folder to analyze |
| outputFile (opt)    | The name and path to the outputFile relative to the folder.  |
| options       | An object containing configuration options  |

### Available options
| option      | notes                     |
| ------------- | --------------------------------------------- |
| filter        | Either an array of globs or a filter function that accepts a file path and returns true if the file path should be used as a module. |
| template      | Either a string or a function. If a string valid values are 'es5' or 'esnext'. If a template function the function should takes an array of relative module paths and output the module file as a string |
| dontWrite  | Return the output as a string instead of writing to a file |

## Node API example

```javascript
import indexr from 'indexr';

indexr('./app', 'server-index.js', {filter: ['./*/server.js'])
```

CLI Signature

```bash
indexr <folder> [--filename <filename>] [--glob <glob>]
```
CLI Example

```bash
indexr ./app --filename server-index.js --glob ./*/server.js
```







