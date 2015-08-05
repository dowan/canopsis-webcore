module('integration tests', {
    setup: function() {
        Ember.run(function() {
        });
    },
    teardown: function() {
        // $.mockjaxClear();
    }
});

test('delete will remove the person for a given row', function() {
    expect(1);
    visit("/");
    andThen(function() {
        var header = find(".logo img");
        equal(header.attr('alt'), 'canopsis', "Empty page found");
    });
});
