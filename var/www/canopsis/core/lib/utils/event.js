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
    'app/lib/utilityclass'
], function(Ember, Utility) {

    var get = Ember.get,
        set = Ember.set,
        __ = Ember.String.loc,
        isNone = Ember.isNone;

    //TODO delete this, as it looks more like a registry than an util
    var eventUtil= Utility.create({

        name: 'event',

        getFields: function() {
            return [
                'connector',
                'connector_name',
                'component',
                'resource',
                'perimeter',
                'domain',
                'state',
                'status',
                'timestamp',
                'output'
            ];
        },
    });

    Ember.Application.initializer({
        name:"EventUtils",
        initialize: function(container, application) {
            application.register('utility:event', eventUtil);
        }
    });

    return eventUtil;
});
