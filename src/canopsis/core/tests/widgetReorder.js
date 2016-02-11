module('widget reorder');

test('Creating two widgets and reorder them', function() {
    visit('/userview/view.event');

    expect(4);

    click('.nav-tabs-custom .cog-menu');
    click('.nav-tabs-custom .btn-add-view');

    waitForElement('input[name=crecord_name]').then(function(){
        fillIn('input[name=crecord_name]', 'test reorder');
        click('.form .btn-submit');

    });
    click('.nav-tabs-custom .cog-menu');
    click('.nav-tabs-custom .btn-toggle-edit-mode');
    click('.btn-add-widget');

    waitForElement('.form .ember-text-field').then(function(){
        fillIn('.form .ember-text-field', 'text');
        click('.form .panel-default:first a');
        click('.form .list-group-item a');
        click('.form .btn-submit');
        click('.form .btn-submit');
    });

    waitForElementRemoval('.modal-backdrop').then(function() {
        click('.btn-add-widget');

        waitForElement('.form .ember-text-field').then(function(){
            fillIn('.form .ember-text-field', 'weather');
            click('.form .panel-default:first a');
            click('.form .list-group-item a');
            click('.form .btn-submit');
            click('.form .btn-submit');

            waitForElement('.weatherminsize').then(function() {
                equal(find('.box-title').text(), "< Untitled text widget >< Untitled weather widget >", 'A text widget, then a weather widget');
                click('.btn-move-down:first');
                equal(find('.box-title').text(), "< Untitled weather widget >< Untitled text widget >", 'A weather widget, then a text widget');
                click('.btn-move-up:last');
                waitMilliseconds(500).then(function() {
                    equal(find('.box-title').text(), "< Untitled text widget >< Untitled weather widget >", 'A text widget, then a weather widget');
                    click('.btn-move-up:first');
                    click('.btn-move-down:last');
                    equal(find('.box-title').text(), "< Untitled text widget >< Untitled weather widget >", 'A text widget, then a weather widget');
                });
            });
        });
    });
});
