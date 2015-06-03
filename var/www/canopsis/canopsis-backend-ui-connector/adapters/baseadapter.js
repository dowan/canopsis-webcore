define([
    'ember',
    'canopsis/canopsis-backend-ui-connector/adapters/application',
    'app/lib/utils/modelsolve'
], function(Ember, ApplicationAdapter, modelsolve) {

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
            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                $.post(url, query).then(funcres, funcrej);
            });

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

            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                $.ajax(
                    {
                        url: url,
                        type: 'POST',
                        data: {
                            'document' : JSON.stringify(context),
                        }
                    }
                ).then(funcres, funcrej);
            });

            return promise;
        },

        updateRecord: function(store, type, record) {
            return this.createRecord(store, type, record);
        },

        deleteRecord: function(store, type, record) {
            var id = get(record, 'id');
            var data = { ids: id};
            var url = this.buildURL(type.typeKey, id);

            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                $.ajax(
                    {
                        url: url,
                        type: 'DELETE',
                        data: {
                            ids : JSON.stringify([id])
                        }
                    }
                ).then(funcres, funcrej);
            });

            return promise;
        },

    });


    loader.register('adapter:baseadapter', adapter);

    return adapter;
});
