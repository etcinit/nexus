"use strict";

require('ensure.js');
require("babel/register"); // Use ES6
require('enclosure').bootstrap();

var path = require('path');

var Application = use('Chromabits/Container/Application'),
    Loader = use('Chromabits/Loader/Loader'),
    DirectoryMapper = use('Chromabits/Mapper/DirectoryMapper'),
    EnclosureMap = use('Chromabits/Mapper/EnclosureClassMap');

// Setup class autoloading
var loader = new Loader();
var mapper = new DirectoryMapper(path.resolve(__dirname, './src/'));

loader.addMap(mapper.generate());
loader.addMap(EnclosureMap);

// Start the service container
var application = new Application();

application.setLoader(loader);
application.installTo(global);

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
