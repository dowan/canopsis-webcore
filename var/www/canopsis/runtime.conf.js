/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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
    'canopsis/commit',
    'app/lib/loaders/utils',
    'app/lib/registries',
    'app/lib/wrappersmanager',
    'app/lib/formsregistry',
    'app/lib/indexesregistry',
    'app/lib/actionsregistry',
    'app/lib/loaders/helpers',
    'app/lib/loaders/components',
    'canopsis/canopsisConfiguration',
], function(commit,
        utils,
        registries,
        wrappersRegistry,
        formsRegistry,
        indexesRegistry,
        actionsRegistry,
        helpers,
        templates,
        components,
        canopsisConfiguration) {

    var Canopsis = {};

    Canopsis.registries = registries;
    Canopsis.tooltips = {};
    Canopsis.utils = utils;
    Canopsis.wrappers = wrappersRegistry;
    Canopsis.actions = actionsRegistry;
    Canopsis.indexes = indexesRegistry;
    Canopsis.forms = formsRegistry;
    Canopsis.helpers = helpers;
    Canopsis.templates = templates;
    Canopsis.components = components;
    Canopsis.commit = commit;
    Canopsis.conf = canopsisConfiguration;

    console.log('Canopsis configuration', Canopsis.conf);

    return Canopsis;
});
