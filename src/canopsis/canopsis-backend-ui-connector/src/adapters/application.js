//TODO move ApplicationAdapter from requirejsmodules to here

/**
 * @adapter Application
 * @description Main adapter for Canopsis. This adapter is used by default.
 *
 * > Note that the current adapters design is not yet clean. There should be one adapter per data source, not one per data type.
 *
 * Adapters should follow this hierarchy : 
 *
 * ![Adapters UML](../images/adapters_uml.png)
 *
 */
         /**
         * @method ajax
         * @description Override allowing to use the promisemanager
         */
         /**
         * @method buildURL
         * @argument type
         * @argument id
         * @description builds the url for any kind of request. Override this on your adapter if you need to make queries to specific urls.
         * @return {string} the url of the query
         */
        /**
         * @method createRecord
         */
        /**
         * @method updateRecord
         */