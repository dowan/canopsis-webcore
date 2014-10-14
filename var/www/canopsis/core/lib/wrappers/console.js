define([], function() {

    delete console.init;

    //add init tag that will encapsulate the webapp loading process
    console.tags = {
        add: function() {},
        remove: function () {}
    };

    console.settings = {
        save: function() {}
    };
    console.tags.add('init');

    //reactivate when console will be ready again
    //if (navigator.appName.indexOf('Internet Explorer') !== -1) {

        console.group = function () {};
        console.groupEnd = function() {};
        console.debug = console.log;
        console.warning = console.log;
        console.error = console.log;
    //}

    return console;
});
