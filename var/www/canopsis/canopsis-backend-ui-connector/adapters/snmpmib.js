define([
    'ember',
    'canopsis/canopsis-backend-ui-connector/adapters/application',
    'app/lib/utils/modelsolve'
], function(Ember, ApplicationAdapter, modelsolve) {

    var isNone = Ember.isNone,
        get = Ember.get;

    var adapter = ApplicationAdapter.extend({

        findMib: function(type, query) {
            var url = '/snmpmib';

            console.log('findQuery', query);
            var me = this;
            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                $.post(url, query).then(funcres, funcrej);
            });

        },

        uploadmib: function (type, query) {
            var url = '/uploadmib';

            console.log('upload file', query);
            var me = this;
            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                $.post(url, query).then(funcres, funcrej);
            });

        }

    });

    loader.register('adapter:snmpmib', adapter);

    return adapter;
});
