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

Node API
```bash


```bash
indexr <folder> [--filename <filename>] [--glob <glob>]
```





