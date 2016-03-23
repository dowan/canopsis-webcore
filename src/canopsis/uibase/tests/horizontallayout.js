module('uibase', {
  beforeEach: function() {
    $('.modal-backdrop').remove();
  },
  afterEach: function() {
    $('.modal-backdrop').remove();
  }
});

test('Horizontal layout', function() {
    expect(2);

    visit('/userview/view.event');


    createNewView('horizontallayout_test');

    activateEditMode();
    click('.btn-add-widget');

    waitForElement('.form .ember-text-field').then(function(){
        fillIn('.form .ember-text-field', 'widgetcontainer');
        click('.form .panel-default a');
        click('.form .list-group-item a');
        click('.form #mixins_tab a');
        fillIn('.tab-pane.active input', 'horizontal');
        click('.form .panel-default .panel-heading a');
        click('.form .panel-default .list-group a');
        click('.form .btn-submit');

        waitForElementRemoval('.modal-backdrop').then(function() {
          click('.widgetslot .btn-add-widget');
          waitForElement('.form .ember-text-field').then(function(){
            fillIn('.form .ember-text-field', 'text');
            click('.form .panel-default a');
            click('.form .list-group-item a');
            click('.form .btn-submit');

            waitForElementRemoval('.modal-backdrop').then(function() {
              click('.widgetslot .btn-add-widget');
              fillIn('.form .ember-text-field', 'text');
              click('.form .panel-default a');
              click('.form .list-group-item a');
              click('.form .btn-submit');

              waitForElementRemoval('.modal-backdrop').then(function() {
                equal($(find('.widgetslot .widgetslot')[0]).offset().top, $(find('.widgetslot .widgetslot')[1]).offset().top, 'both widgets are horizonally displayed');
                equal($(find('.widgetslot .widgetslot')[0]).height(), $(find('.widgetslot .widgetslot')[1]).height(), 'both widgets have the same height');
              });
            });
          });
        });
    });
});
