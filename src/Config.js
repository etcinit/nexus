"use strict";

var Config;

// Right now, we're just passing along the default config file
// Eventually, this should dynamically load other config files
Config = require('../config/default');

module.exports = Config;