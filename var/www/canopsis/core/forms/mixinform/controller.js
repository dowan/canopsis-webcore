/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

define([
    'ember',
    'app/lib/factories/form',
    'app/lib/schemasregistry',
    'app/mixins/inspectableitem',
    'app/mixins/validation',
    'app/mixins/recordpreset',
    'app/lib/utils/slug',
    'app/lib/loaders/schemas'
], function(Ember, FormFactory, schemasRegistry, InspectableitemMixin, ValidationMixin, RecordpresetMixin, slugUtils) {
    var set = Ember.set,
        get = Ember.get,
        isNone = Ember.isNone;

    var formOptions = {
        mixins: [
            InspectableitemMixin,
            ValidationMixin
        ]
    };

    /**
     * @class Generic form which dynamically generates its content by reading a model's schema
     */
    var form = FormFactory('mixinform', {
        needs: ['application']
    },
    formOptions);

    return form;
});
