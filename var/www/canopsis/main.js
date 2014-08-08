define([
	'canopsis/commit',
	'seeds/RoutesLoader',
	'app/application',
	'utils',
	'app/lib/wrappersmanager',
	'app/lib/formsmanager',
	'app/lib/widgetsmanager',
	'app/lib/inflections',
	'app/lib/loaders/factories',
	'app/lib/loaders/helpers',
	'app/lib/loaders/templates',
	'app/lib/loaders/components',
	'canopsis/canopsisConfiguration',
	'app/routes/authenticated',
	'app/routes/event',
	'app/routes/services',
	'app/adapters/application',
	'app/adapters/ack',
	'app/adapters/cancel',
	'app/adapters/entity',
	'app/adapters/metric',
	'app/adapters/connector',
	'app/serializers/application',
	'bootstrap',
	'colorpicker',
	'gridster',
	'timepicker',
	'app/lib/wrappers/console',
	'app/lib/wrappers/icheck',
	'app/lib/loaders/editors',
	'app/lib/loaders/renderers',
	'app/lib/loaders/widgets',
	'app/lib/loaders/forms',
	'app/lib/loaders/validators',
	'app/lib/loaders/mixins',
	'app/routes/application',
	'css3-mediaqueries'
], function(commit,
	    routesLoader,
	    Application,
	    utils,
	    wrappersManager,
	    formsManager,
	    widgetsManager,
	    inflectionsManager,
	    factories,
	    helpers,
	    templates,
	    components,
	    canopsisConfiguration) {


	window.Canopsis = {};

	Canopsis.utils = utils;
	Canopsis.wrappers = wrappersManager;
	Canopsis.widgets = widgetsManager;
	Canopsis.inflections = inflectionsManager;
	Canopsis.forms = formsManager;
	//Canopsis.AllModels = [];
	Canopsis.manifest = Application.manifest;
	Canopsis.factories = factories;
	Canopsis.helpers = helpers;
	Canopsis.templates = templates;
	Canopsis.components = components;
	Canopsis.Application = Application;
	Canopsis.commit = commit;
	Canopsis.editMode = false;

	window.debugName = [ "ajaxCall",
						// "confirmForm.submit"
						//"confirmform.makeObject",
						//"connectorform.availableConnectors"
						//"connectorform.submit"
						//"multicrecordList.editConf"
						//"setReceivedConf",
						//"confirmForm.submit"
						//"helper.conf"
						 ];
	window.breakPoint = function( caller){
		//var caller = arguments.callee.caller.name;
		if( window.debugName.contains( caller ))
			debugger;
	};



	Canopsis.conf = canopsisConfiguration;
	console.log('Canopsis configuration', Canopsis.conf);
	//TEMP
	Application.connector = [ { name : "nagios" }, { name : "shinken" } , { name : "schneider" } , { name : "collectd" }];

	Application.manifest = routes;
	routesLoader.initializeRoutes(
		Application,
		routes,
		function () {
			console.log('Routes initialization callback');
	});
});