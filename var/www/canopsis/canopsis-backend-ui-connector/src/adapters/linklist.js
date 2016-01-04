
Ember.Application.initializer({
    name: 'LinklistAdapter',
    after: 'BaseAdapter',
    initialize: function(container, application) {
        var BaseAdapter = container.lookupFactory('adapter:base');

        var isNone = Ember.isNone,
            get = Ember.get;

        /**
         * @adapter linklist
         */
        var adapter = BaseAdapter.extend({

            buildURL: function(type, id) {
                void(id);

                return '/linklist';
            },

        });

        application.register('adapter:linklist', adapter);
    }
});
