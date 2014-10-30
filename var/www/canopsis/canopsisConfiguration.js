define([], function () {

    /*
    * Here is the canopsis UI main configuration file.
    * It is possible to add properies and values that are reachable
    * from the whole application through the namespace Canopsis.conf.PROPERTY
    */
    var canopsisConfiguration = {
        DEBUG: true,
        VERBOSE: 1,
        DISPLAY_SCHEMA_MANAGER: true,
        REFRESH_ALL_WIDGETS: true,
        TRANSLATE: true,
        SHOW_TRANSLATIONS: false
    };

    if(canopsisConfiguration.DEBUG === false) {
        console.log = function() {};
        console.warn = function() {};
        console.debug = function() {};
        console.group = function() {};
        console.groupEnd = function() {};
    }

    return canopsisConfiguration;
});
