define([
    'canopsis/canopsis-backend-ui-connector/adapters/baseadapter'
], function(BaseAdapter) {

    var isNone = Ember.isNone,
        get = Ember.get;

    var adapter = BaseAdapter.extend({

        buildURL: function(type, id) {
            void(id);

            return '/linklist';
        },

    });

    Ember.Application.initializer({
        name: 'LinklistAdapter',
        initialize: function(container, application) {
            application.register('adapter:linklist', adapter);
        }
    });

    return adapter;
});
