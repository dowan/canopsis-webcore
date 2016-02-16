/*
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

 require.config({
    paths: {
        'actionbutton-viewrights': 'canopsis/canopsis-rights/dist/templates/actionbutton-viewrights',
        'components/component-right-checksum': 'canopsis/canopsis-rights/dist/templates/components/component-right-checksum',
        'components/component-rights-action': 'canopsis/canopsis-rights/dist/templates/components/component-rights-action',
        'components/component-rightsrenderer': 'canopsis/canopsis-rights/dist/templates/components/component-rightsrenderer',
        'components/component-rightsselector': 'canopsis/canopsis-rights/dist/templates/components/component-rightsselector',
        'editor-rights': 'canopsis/canopsis-rights/dist/templates/editor-rights',
        'renderer-rights': 'canopsis/canopsis-rights/dist/templates/renderer-rights',
        'rightschecksumbuttons': 'canopsis/canopsis-rights/dist/templates/rightschecksumbuttons',
        'rightselector-itempartial': 'canopsis/canopsis-rights/dist/templates/rightselector-itempartial',
        'rightselector-selecteditempartial': 'canopsis/canopsis-rights/dist/templates/rightselector-selecteditempartial',
        'viewrightsform': 'canopsis/canopsis-rights/dist/templates/viewrightsform',

    }
});

 define([
    'link!canopsis/canopsis-rights/dist/brick.min.css',
    'ehbs!actionbutton-viewrights',
    'ehbs!components/component-right-checksum',
    'ehbs!components/component-rights-action',
    'ehbs!components/component-rightsrenderer',
    'ehbs!components/component-rightsselector',
    'ehbs!editor-rights',
    'ehbs!renderer-rights',
    'ehbs!rightschecksumbuttons',
    'ehbs!rightselector-itempartial',
    'ehbs!rightselector-selecteditempartial',
    'ehbs!viewrightsform',
    'canopsis/canopsis-rights/dist/brick.min'
], function () {});
