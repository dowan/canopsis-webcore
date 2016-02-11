module('default views');

test('Test app_header', function() {

    visit('/userview/view.app_header');

    andThen(function() {
        equal(find('.tab-content .nav-tabs').length, 1, 'There is a bootstrap nav-tabs in the view');
    });
});

test('Test app_footer', function() {

    visit('/userview/view.app_footer');

    andThen(function() {
        equal(
            find('.tab-content img:first')[0].src,
            'http://localhost:8082/static/canopsis/media/sakura.png',
            'Canopsis logo is present'
        );
    });
});
