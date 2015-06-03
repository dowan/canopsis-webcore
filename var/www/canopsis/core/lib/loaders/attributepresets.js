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

var presets = [
    { name: 'No loading info', classes: ['selected_tags'], value: [
        'helpers/renderer.js',
        'mixins/inspectablearray.js',
        'mixins/embeddedrecordserializer.js',
        'loaders/editors.js',
        'loaders/schema-manager.js',
        'loaders/utils.js',
        'helpers/i18n.js',
        'loaders/utils.js',
        'factories/widget.js',
        'loaders/schemas.js',
        'editor/component.js',
        'mixins/metaserializer.js',
        'lib/promisesmanager.js',
        'array/component.js',
        'filterclause/component.js',
        'modelform/controller.js',
        'utils/i18n.js',
        'view/widget.js',
        'init',
        'wrappers/ember-data.js',
        'routes/application.js',
        'loader'
    ]}, { name: 'All', classes: ['selected_tags'], value: []}

];

var presetsDeps = ['app/lib/attributepreset'];
var presetsDepsSize = presetsDeps.length;

define(presetsDeps, function(Attributepreset) {
    for (var i = 0, l = presets.length; i < l; i++) {
        var attr = Attributepreset.create(presets[i]);
    }
});
