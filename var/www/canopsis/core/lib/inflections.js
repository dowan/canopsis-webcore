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
 */

Ember.Application.initializer({
    name: 'InflexionsRegistry',
    after: 'AbstractClassRegistry',
    initialize: function(container, application) {
        var Abstractclassregistry = container.lookupFactory('registry:abstractclass');

        var inflexions = [
            ['nagios' , 'nagios'],
            ['tcp2canopsis' , 'tcp2canopsis'],
            ['curve', 'curves'],
            ['serie', 'serie'],
            ['enabledmodules', 'enabledmodules'],
            ['calendardata','calendardata'],
            ['eventcategories', 'eventcategories']
        ];

        /**
         * Inflections Registry
         *
         * @class InflectionsRegistry
         * @memberOf canopsis.frontend.core
         * @extends Abstractclassregistry
         * @static
         */
        var registry = Abstractclassregistry.create({
            name: 'InflectionsRegistry',
            all: [],
            byClass: {},
            tableColumns: [{title: 'name', name: 'name'}, {title: 'Singular', name: 'singular'}, {title: 'Plural', name: 'plural'}],

            loadInflections: function() {
                for (var i = 0, l = inflexions.length; i < l; i++) {
                    registry.all.pushObject({
                        name: inflexions[i][0] + ' -> ' + inflexions[i][1],
                        singular: inflexions[i][0],
                        plural: inflexions[i][1]
                    });
                    Ember.Inflector.inflector.irregular(inflexions[i][0], inflexions[i][1]);
                }
            }
        });

        application.register('registry:inflexions', registry);
    }
});
