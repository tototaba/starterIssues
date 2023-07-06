#!/usr/bin/env node
const process = require('process');
const exepath = process.env.npm_execpath;

if (exepath && exepath.includes('yarn')) return 0;

console.error('error - this script must be run from within yarn!');
if (exepath) console.info('npm_execpath: ', exepath);
process.exit(1);
