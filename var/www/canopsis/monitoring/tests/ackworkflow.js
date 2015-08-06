module('integration tests', {
    setup: function() {},
    teardown: function() {}
});

test('delete will remove the person for a given row', function() {
    expect(1);
    visit('/userview/view.event');

    andThen(function() {
        var listWidgetsCount = find('.widget.list').length;
        equal(listWidgetsCount, 1, 'One list widget found');

        var json = {
            total:0,
            data:[{
                "status":1,
                "crecord_type":"event",
                "event_type":"check",
                "timestamp":1438698464,
                "component":"A",
                "source_type":"resource",
                "id":"Engine.engine.check.resource.A.B",
                "resource":"B",
                "event_id":"Engine.engine.check.resource.A.B",
                "connector":"Engine",
                "state":2,
                "connector_name":"engine",
                "output":"",
                "_id":"Engine.engine.check.resource.A.B",
                "rk":"Engine.engine.check.resource.A.B"
            }],
            success:true
        };

        stubEndpointForHttpRequest('/rest/events', json);

        $D.getViewFromJqueryElement($('.widget.list')).get('controller').refreshContent();

        Ember.run.later(function(){
            click('.listline button');
            andThen(function() {
                fillIn('.modal-content .ember-text-field', 'ticketNumber');
                fillIn('.modal-content .ember-text-area', 'reason');
                andThen(function() {
                    click('.modal-footer .btn-success');
                });
            })
        }, 1000);
    });
});
