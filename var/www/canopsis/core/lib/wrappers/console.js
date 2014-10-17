var deps = [];
if (!isIE) {
    deps.push('consolejs');
}

define(deps, function() {

    delete console.init;

    if(!isIE) {
        console.tags.add('init');
    }

    console.debug = console.log;

    return console;
});
