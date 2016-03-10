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
