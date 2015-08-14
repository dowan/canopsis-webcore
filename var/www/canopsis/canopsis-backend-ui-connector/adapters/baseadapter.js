define([
    'canopsis/canopsis-backend-ui-connector/adapters/application',
    'app/lib/utils/modelsolve'
], function(ApplicationAdapter, modelsolve) {

    var isNone = Ember.isNone,
        get = Ember.get;

    var adapter = ApplicationAdapter.extend({

        buildURL: function(type, id) {
            void(id);
            console.warn('This method have to be overriden');
            return '/';
        },

        findQuery: function(store, type, query) {
            var url = this.buildURL(type, null);

            console.log('findQuery', query);
            var me = this;
            return this.ajax(url, 'POST', {data: query});
        },

        createRecord: function(store, type, record) {
            var context = {};
            if (isNone(type) || isNone(type.typeKey)) {
                console.error('Error while retrieving typeKey from type is it is none.');
            }
            var serializer = store.serializerFor(type.typeKey);

            context = serializer.serializeIntoHash(context, type, record, 'POST', { includeId: true })[0];

            console.log('document', context);

            var url = this.buildURL(type.typeKey, record.id) + '/put';

            return this.ajax(url, 'POST', {data: {document: context}});
        },

        updateRecord: function(store, type, record) {
            return this.createRecord(store, type, record);
        },

        deleteRecord: function(store, type, record) {
            var id = get(record, 'id');
            var data = { ids: id};
            var url = this.buildURL(type.typeKey, id);

            return this.ajax(url, 'DELETE', {data: {ids: [id]}});
        },

    });

    Ember.Application.initializer({
        name: 'BaseAdapter',
        initialize: function(container, application) {
            application.register('adapter:base', adapter);
        }
    });

    return adapter;
});
