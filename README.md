# indexr
A tool for dynamically creating index modules for your ES6 modules.

For use during development of a node.js based application.

ES6 modules are great but they have the problem that they have the requirement they must be able to statically resolve their dependencies. What if you have dynamic modules that should be autoloaded? 

Indexr will automatically generate index modules from your module folders.

