define([
    'ember',
    'canopsis/canopsis-backend-ui-connector/adapters/baseadapter'
], function(Ember, BaseAdapter) {

    var isNone = Ember.isNone,
        get = Ember.get;

    var adapter = BaseAdapter.extend({

        buildURL: function(type, id) {
            void(id);

            return '/linklist';
        },

    });


    loader.register('adapter:linklist', adapter);

    return adapter;
});
