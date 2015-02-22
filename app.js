"use strict";

require('ensure.js');
require("babel/register"); // Use ES6

var enclosure = require('enclosure'),
    path = require('path');

var Application = enclosure.Chromabits.Container.Application,
    Loader = enclosure.Chromabits.Loader.Loader,
    DirectoryMapper = enclosure.Chromabits.Mapper.DirectoryMapper,
    EnclosureMap = enclosure.Chromabits.Mapper.EnclosureClassMap;

// Setup class autoloading
var loader = new Loader();
var mapper = new DirectoryMapper(path.resolve(__dirname, './src/'));

loader.addMap(mapper.generate());
loader.addMap(EnclosureMap);

// Start the service container
var application = new Application();
application.installTo(global);

container.setLoader(loader);

// Register providers
container.addProvider('Providers/ConfigServiceProvider');
container.addProvider('Providers/PreludeServiceProvider');
container.addProvider('Providers/ServerServiceProvider');

container.register();
container.bootProviders();

var prelude = container.make('Prelude');

// Instantiate a new Nexus server and start listening
if (prelude.shouldLoadServer()) {
    container.make('NexusServer').listen();
}
