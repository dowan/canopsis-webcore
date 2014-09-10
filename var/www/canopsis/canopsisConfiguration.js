define([], function () {

    /*
    * Here is the canopsis UI main configuration file.
    * It is possible to add properies and values that are reachable
    * from the whole application throught the namespace Canopsis.conf.PROPERTY
    */
    var canopsisConfiguration = {
        DEBUG: true,
        VERBOSE: 1,
        DISPLAY_SCHAMA_MANAGER: true,
        REFRESH_ALL_WIDGETS: true,
        TRANSLATE: true
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