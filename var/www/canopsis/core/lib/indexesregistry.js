/**
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 *
 * @module canopsis-frontend-core
 */

define([
    'ember',
    'app/lib/abstractclassregistry'
], function(Ember, Abstractclassregistry) {

    /**
     * Indexes Registry
     *
     * @class IndexesRegistry
     * @extends Abstractclassregistry
     * @static
     */
    var registry = Abstractclassregistry.create({
        name: 'indexes'
    });

    registry.add(Ember.Object.create({
        name: 'event',
        tree: {
            'component': {
                '_metas': {
                    'name': "Component"
                },
                'resource': {
                    '_metas': {
                        'name': "Resource",
                        'final':true
                    }
                }
            },
            'connector': {
                '_metas': {
                    'name': "connector"
                },
                'component': {
                    '_metas': {
                        'name': "Component"
                    },
                    'resource': {
                        '_metas': {
                            'name': "Resource",
                            'final':true
                        }
                    }
                }
            }
        }
    }));

    registry.add(Ember.Object.create({
        name: 'crecord',
        tree: {
            'crecord_type': {
                '_metas': {
                    'name': "Crecord type"
                },
                'crecord_name': {
                    '_metas': {
                        'name': "Crecord name",
                        'final':true
                    }
                }
            }
        }
    }));

    Ember.Application.initializer({
        name:"IndexesRegistry",
        initialize: function(container, application) {
            application.register('registry:indexes', registry);
        }
    });

    return registry;
});
