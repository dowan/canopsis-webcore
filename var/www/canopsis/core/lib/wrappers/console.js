define(['consolejs'], function() {

    delete console.init;

    console.debug = console.log;

    // console.log = function(){};
    // console.debug = function(){};
    // console.warn = function(){};
    // console.group = function(){};
    // console.groupEnd = function(){};
    // console.info = function(){};

    return console;
});
