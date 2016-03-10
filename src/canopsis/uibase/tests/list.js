module('uibase');

test('Simple list creation', function() {
    createNewView('list test');

    click('.nav-tabs-custom .cog-menu');
    click('.nav-tabs-custom .btn-toggle-edit-mode');
    click('.btn-add-widget');

    waitForElement('.form .ember-text-field').then(function(){
        fillIn('.form .ember-text-field', 'list');
        click('.form .panel-default:first a');
        click('.form .list-group-item a');
        click('.form .btn-submit');
    });
});

test('Test app_footer', function() {

    visit('/userview/view.app_footer');

    andThen(function() {
        equal(
            find('.tab-content img:first')[0].src.indexOf('static/canopsis/media/sakura.png') !== -1,
            true,
            'Canopsis logo is present'
        );
    });
});
