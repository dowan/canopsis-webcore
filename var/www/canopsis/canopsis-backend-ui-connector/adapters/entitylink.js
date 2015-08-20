define([
    'canopsis/canopsis-backend-ui-connector/adapters/application',
    'app/lib/utils/modelsolve'
], function(ApplicationAdapter, modelsolve) {

    var isNone = Ember.isNone,
        get = Ember.get;

    var adapter = ApplicationAdapter.extend({

        init: function () {
            this._super();
        },

        buildURL: function(type, id) {
            void(id);

            return '/entitylink';
        },

        findEventLinks: function(type, query) {
            var url = this.buildURL(type, null);

            console.log('findQuery', query);
            var me = this;
            return new Ember.RSVP.Promise(function(resolve, reject) {
                var funcres = modelsolve.gen_resolve(resolve);
                var funcrej = modelsolve.gen_reject(reject);
                $.post(url, query).then(funcres, funcrej);
            });

        },
    });

    Ember.Application.initializer({
        name: 'EntityLinkAdapter',
        initialize: function(container, application) {
            application.register('adapter:entitylink', adapter);
        }
    });

    return adapter;
});
