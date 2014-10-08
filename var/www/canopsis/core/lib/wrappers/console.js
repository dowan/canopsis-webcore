define(['consolejs'], function() {

    delete console.init;

    //add init tag that will encapsulate the webapp loading process
    console.tags.add('init');

    console.debug = console.log;

    // console.log = function(){};
    // console.debug = function(){};
    // console.warn = function(){};
    // console.group = function(){};
    // console.groupEnd = function(){};
    // console.info = function(){};

    return console;
});
