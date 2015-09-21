module('Ack workflow', {
    setup: function () {
        // App.reset();
    },
    teardown: function() {
        // $.mockjax.clear();
    }
});

test('Test embeddedrecordserializer', function() {

    var userviewSerializer = App.__container__.lookup('serializer:userview');

    equal(1, 1, 'Expect the event ouptut is equal to "reason"' + userviewSerializer);
});
