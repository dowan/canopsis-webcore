define([
    'ember',
    'app/application',
    'canopsis/canopsis-backend-ui-connector/adapters/baseadapter'
], function(Ember, Application, BaseAdapter) {

    var isNone = Ember.isNone,
        get = Ember.get;

    var adapter = BaseAdapter.extend({

        buildURL: function(type, id) {
            void(id);

            return '/calendar';
        },
        createRecord: function(store, type, record) {
            this._super();
        }
    });


    loader.register('adapter:calendardata', adapter);

    return adapter;
});