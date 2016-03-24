module('uibase', {
  beforeEach: function() {
    $('.modal-backdrop').remove();
  },
  afterEach: function() {
    $('.modal-backdrop').remove();
  }
});

test('Tab layout', function() {
  expect(3);

  visit('/userview/view.event');


  createNewView('tablayout_test');

  changeEditorForKey('html', 'defaultpropertyeditor').then(function() {
      activateEditMode();
      click('.btn-add-widget');

      waitForElement('.form .ember-text-field').then(function(){
          fillIn('.form .ember-text-field', 'widgetcontainer');
          click('.form .panel-default a');
          click('.form .list-group-item a');
          click('.form #mixins_tab a');
          fillIn('.tab-pane.active input', 'tablayout');
          click('.form .panel-default .panel-heading a');
          click('.form .panel-default .list-group a');
          click('.form .btn-submit');

          waitForElementRemoval('.modal-backdrop').then(function() {
            click('.widgetslot .btn-add-widget');
            waitForElement('.form .ember-text-field').then(function(){
              fillIn('.form .ember-text-field', 'text');
              click('.form .panel-default a');
              click('.form .list-group-item a');
              fillIn('.form input[name=title]', 'widget1');
              fillIn('.form input[name=html]', 'textwidget1');
              click('.form .btn-submit');

              waitForElementRemoval('.modal-backdrop').then(function() {
                click('.widgetslot .btn-add-widget');
                fillIn('.form .ember-text-field', 'text');
                click('.form .panel-default a');
                click('.form .list-group-item a');
                fillIn('.form input[name=title]', 'widget2');
                fillIn('.form input[name=html]', 'textwidget2');
                click('.form .btn-submit');

                waitForElementRemoval('.modal-backdrop').then(function() {
                  equal(find('.content .widgetslot .nav-tabs-custom a').length, 2, '2 tab headers are present');
                  click('.content .widgetslot .nav-tabs-custom a:first');
                  waitMilliseconds(200).then(function(){
                    equal(find('.content .widgetslot .nav-tabs-custom>div').html(), 'textwidget1\n', 'first tab content ok');
                    click('.content .widgetslot .nav-tabs-custom a:last');
                    waitMilliseconds(200).then(function(){
                      equal(find('.content .widgetslot .nav-tabs-custom>div').html(), 'textwidget2\n', 'last tab content ok');
                    });
                  })
                });
              });
            });
        });
      });
    });
});
