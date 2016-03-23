module('uibase', {
  beforeEach: function() {
    $('.modal-backdrop').remove();
  },
  afterEach: function() {
    $('.modal-backdrop').remove();
  }
});

test('Simple text creation', function() {
    expect(1);

    visit('/userview/view.event');

    createNewView('text_test');

    activateEditMode();
    click('.btn-add-widget');

    waitForElement('.form .ember-text-field').then(function(){
        fillIn('.form .ember-text-field', 'text');
        click('.form .panel-default:first a');
        click('.form .list-group-item a');
        click('.form .btn-submit');

        waitMilliseconds(500).then(function(){
            equal(find('.tab-content .widget').length, 1, 'there is one widget in the view');
        });
    });
});

test('Text with html', function() {
    expect(1);

    visit('/userview/view.event');

    createNewView('text_test 2');

    activateEditMode();

    changeEditorForKey('html', 'defaultpropertyeditor').then(function() {
        click('.btn-add-widget');

        waitForElement('.form .ember-text-field').then(function(){
            fillIn('.form .ember-text-field', 'text');
            click('.form .panel-default:first a');
            click('.form .list-group-item a');

            fillIn('input[name=title]', 'test html');
            fillIn('input[name=html]', '<hr/><hr/><hr/>');

            click('.form .btn-submit');
            waitForElementRemoval('.modal-backdrop').then(function() {
                equal(find('.tab-content .widget hr').length, 3, 'there is three hr elements into the text widget');
            });
        });
    });
});

test('Text with events', function() {
    expect(1);

    $.mockjax({
        url: "/rest/object/view/view_test_text_events",
        responseText: {
            "total": 1,
            "data": [{
                "crecord_write_time": 1458057864,
                "enable": true,
                "description": null,
                "author": "root",
                "containerwidget": {
                    "widgetId": null,
                    "preference_id": null,
                    "xtype": "widgetcontainer",
                    "title": null,
                    "widgetslotTemplate": null,
                    "mixins": [{
                        "name": "verticallayout"
                    }, {
                        "name": "widgetrefresh"
                    }],
                    "items": [{
                        "id": "widgetwrapper_6a16af8f-a6a1-cf7a-b043-47dec5e2e6e1",
                        "widget": {
                            "time_window": 86400,
                            "widgetId": "widget_text_3c8f5962-44c5-833d-2521-1e490395505b",
                            "preference_id": null,
                            "xtype": "text",
                            "title": "test html",
                            "series": [],
                            "mixins": [],
                            "id": "widget_text_3c8f5962-44c5-833d-2521-1e490395505b",
                            "metrics": [],
                            "time_window_offset": null,
                            "html": "text widget with events : {{event.ev.event_type}}",
                            "tagName": null,
                            "events": [{"label": "ev", "rk": "Engine.engine.check.resource.componentTest.resourceTest"}]
                        },
                        "mixins": [],
                        "xtype": "widgetwrapper",
                        "title": "wrapper"
                    }],
                    "id": "container_55706ea4-79f9-9d6e-dad2-9d8befed112d"
                },
                "tags": [],
                "crecord_creation_time": 0,
                "crecord_type": "view",
                "id": "view_test_text_events",
                "_id": "view_test_text_events",
                "internal": false,
                "crecord_name": "view_test_text_events"
            }],
            "success": true
        }
    });

    $.mockjax({
      url: "/rest/events",
      responseText: {
        "total": 1,
        "data": [{
            "status": 0,
            "crecord_type":
            "event",
            "bagot_freq": 0,
            "enable": true,
            "event_type": "check",
            "tags": ["engine", "check", "resource", "componentTest", "resourceTest"],
            "timestamp": 1458036175,
            "entity_id": "/resource/Engine/engine/componentTest/resourceTest",
            "ts_first_bagot": 0,
            "crecord_write_time": null,
            "state_type": 1,
            "source_type": "resource",
            "downtime": false,
            "perf_data_array": [{"metric": "cps_evt_per_sec", "unit": "evt", "value": 0.8, "retention": 3600}, {"metric": "cps_sec_per_evt", "value": 0.01129, "warn": 0.6, "crit": 0.9, "unit": "s", "retention": 3600}],
            "id": "Engine.engine.check.resource.componentTest.resourceTest",
            "crecord_name": "noname",
            "resource": "resourceTest",
            "last_state_change": 1458030709,
            "connector": "Engine",
            "long_output": null,
            "state": 0,
            "connector_name": "engine",
            "component": "componentTest",
            "ts_first_stealthy": 0,
            "output": "1.78 evt/sec, 0.00726 sec/evt",
            "_id": "Engine.engine.check.resource.componentTest.resourceTest",
            "component_problem": false,
            "rk": "Engine.engine.check.resource.componentTest.resourceTest"}],
        "success": true
        }
    });

    visit('/userview/view_test_text_events');
    waitForElement('.content .widget .widget').then(function() {
        equal(find('.content .widget .widget').html(), 'text widget with events : check\n', 'event correctly fetched and displayed');
        $.mockjax.clear();
    });
});

test('Text with metrics', function() {
    expect(1);

    $.mockjax({
        url: "/rest/object/view/view_test_text_events",
        responseText: {
            "total": 1,
            "data": [{
                "loader_id":
                "view.services",
                "enable": true,
                "description": null,
                "author": null,
                "containerwidget": {
                    "widgetId": null,
                    "preference_id": null,
                    "xtype": "widgetcontainer",
                    "title": "container title vbox services2",
                    "widgetslotTemplate": null,
                    "mixins": [{"name": "verticallayout"}, {"name": "widgetrefresh"}, {"name": "widgetfullscreen"}],
                    "tagName": null,
                    "items": [{
                        "id": "item_1c9cf766-39b2-ba8c-8007-2054ff51e3b2",
                        "widget": {
                            "time_window": 86400,
                            "widgetId": "item_4d8d086e-c89a-507d-fae6-c8f86f962dbe",
                            "preference_id": null,
                            "xtype": "text",
                            "title": "Global overview",
                            "series": [],
                            "mixins": [],
                            "id": "item_c8b91422-29d5-3d10-a862-36e836031665",
                            "metrics": ["/metric/connector/connectorname/testcomponent/testresource/testmetric"],
                            "time_window_offset": null,
                            "html": "{{event.ev.state}}",
                            "tagName": null,
                            "events": []
                        },
                        "mixins": [],
                        "xtype": "widgetwrapper",
                        "title": "Services"
                    }],
                    "id": "item_c9b3cbed-a553-f3c4-83b3-cbfa25a70fe0"
                },
                "tags": [],
                "crecord_write_time": 1458060400,
                "id": "view.services",
                "crecord_type": "view",
                "internal": false,
                "_id": "view.services",
                "crecord_creation_time": 0,
                "crecord_name": "Services",
                "loader_no_update": true
            }], "success": true
        }
    });

    $.mockjax({
      url: "/rest/events",
      responseText: {
        "total": 1,
        "data": [{
            "status": 0,
            "crecord_type":
            "event",
            "bagot_freq": 0,
            "enable": true,
            "event_type": "check",
            "tags": ["engine", "check", "resource", "componentTest", "resourceTest"],
            "timestamp": 1458036175,
            "entity_id": "/resource/Engine/engine/componentTest/resourceTest",
            "ts_first_bagot": 0,
            "crecord_write_time": null,
            "state_type": 1,
            "source_type": "resource",
            "downtime": false,
            "perf_data_array": [{"metric": "cps_evt_per_sec", "unit": "evt", "value": 0.8, "retention": 3600}, {"metric": "cps_sec_per_evt", "value": 0.01129, "warn": 0.6, "crit": 0.9, "unit": "s", "retention": 3600}],
            "id": "Engine.engine.check.resource.componentTest.resourceTest",
            "crecord_name": "noname",
            "resource": "resourceTest",
            "last_state_change": 1458030709,
            "connector": "Engine",
            "long_output": null,
            "state": 0,
            "connector_name": "engine",
            "component": "componentTest",
            "ts_first_stealthy": 0,
            "output": "1.78 evt/sec, 0.00726 sec/evt",
            "_id": "Engine.engine.check.resource.componentTest.resourceTest",
            "component_problem": false,
            "rk": "Engine.engine.check.resource.componentTest.resourceTest"}],
        "success": true
        }
    });

    visit('/userview/view_test_text_events');
    waitForElement('.content .widget .widget').then(function() {
        equal(find('.content .widget .widget').html(), 'text widget with events : check\n', 'event correctly fetched and displayed');
        $.mockjax.clear();
    });
});
