module('uibase', {
  beforeEach: function() {
    $('.modal-backdrop').remove();
  },
  afterEach: function() {
    $('.modal-backdrop').remove();
  }
});

test('Vertical layout', function() {
  expect(2);

  visit('/userview/view.event');


  createNewView('verticallayout_test');

  activateEditMode();
  click('.btn-add-widget');

  waitForElement('.form .ember-text-field').then(function(){
      fillIn('.form .ember-text-field', 'widgetcontainer');
      click('.form .panel-default a');
      click('.form .list-group-item a');
      click('.form #mixins_tab a');
      fillIn('.tab-pane.active input', 'vertical');
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
              equal($(find('.widgetslot .widgetslot')[0]).offset().left, $(find('.widgetslot .widgetslot')[1]).offset().left, 'both widgets are vertically displayed');
              equal($(find('.widgetslot .widgetslot')[0]).width(), $(find('.widgetslot .widgetslot')[1]).width(), 'both widgets have the same width');
            });
          });
        });
      });
  });
});
