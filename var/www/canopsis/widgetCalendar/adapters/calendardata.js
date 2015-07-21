
define([
    'canopsis/canopsis-backend-ui-connector/adapters/baseadapter'
], function(BaseAdapter) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var _upsertRecord = function(adapter, verb, store, type, record) {
        var serializer = store.serializerFor(type.typeKey);
        var serializedRecords = serializer.serializeIntoHash({}, type, record, verb, { includeId: true
        });

        var query = {
            data: serializedRecords[0]
        };

        return adapter.ajax(adapter.buildURL(), verb, query);
    };

    var adapter = BaseAdapter.extend({

        buildURL: function(type, id, record) {
            void(type);
            void(record);

            var result = '/calendar';

            if (!isNone(id)) {
                result += '/' + id;
            }

            return result;
        },

        findQuery: function(store, type, query) {
            var url = this.buildURL(type, null);
            url = url.concat('/values');

            console.log('findQuery', query);
            return this.ajax(url, 'GET', {data: query});
        },

        createRecord: function(store, type, record) {
            var createdRecord = _upsertRecord(this, 'POST', store, type, record);
            return createdRecord;
        },

        updateRecord: function(store, type, record) {
            return _upsertRecord(this, 'PUT', store, type, record);
        }
    });

    loader.register('adapter:calendardata', adapter);

    return adapter;
});
