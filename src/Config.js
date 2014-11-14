"use strict";

var Config,
    fs = require('fs'),
    path = require('path'),
    winston = require('winston');

// Load alternative config file instead of default one
if (process.env.NODE_ENV === 'testing') {
    // Load default testing configuration
    Config = require('../config/testing');
} else if (fs.existsSync(path.resolve(__dirname, '../config/main.js'))) {
    winston.info('Loaded alternate config file');
    Config = require('../config/main');
} else {
    // Load default configuration
    Config = require('../config/default');
}

module.exports = Config;