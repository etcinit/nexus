"use strict";

var Config,
    fs = require('fs'),
    path = require('path');

// Load alternative config file instead of default one
if (fs.existsSync(path.resolve(__dirname, '../config/main.js'))) {
    console.log('Loaded alternate config file');
    Config = require('../config/main');
} else {
    // Load default configuration
    Config = require('../config/default');
}

module.exports = Config;