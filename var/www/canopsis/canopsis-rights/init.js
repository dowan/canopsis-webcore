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

/** @module canopsis.frontend.canopsis-rights */

require.config({
    paths: {
        'components/component-rightsselector': 'canopsis/canopsis-rights/src/components/rightsselector/template',
        'components/component-rights-action': 'canopsis/canopsis-rights/src/components/rights-action/template',
        'components/component-rightsrenderer': 'canopsis/canopsis-rights/src/components/rightsrenderer/template',
        'components/component-right-checksum': 'canopsis/canopsis-rights/src/components/right-checksum/template',
        'editor-rights': 'canopsis/canopsis-rights/src/editors/editor-rights',
        'viewrightsform': 'canopsis/canopsis-rights/src/forms/viewrightsform/viewrightsform',
        'renderer-rights': 'canopsis/canopsis-rights/src/renderers/renderer-rights',
        'rightschecksumbuttons': 'canopsis/canopsis-rights/src/templates/rightschecksumbuttons',
        'rightselector-itempartial': 'canopsis/canopsis-rights/src/templates/rightselector-itempartial',
        'rightselector-selecteditempartial': 'canopsis/canopsis-rights/src/templates/rightselector-selecteditempartial',
        'actionbutton-viewrights': 'canopsis/canopsis-rights/src/templates/actionbutton-viewrights'
    }
});

define([
    'canopsis/canopsis-rights/src/objects/rightsregistry',
    'canopsis/canopsis-rights/src/utils/rightsflags',
    'canopsis/canopsis-rights/src/reopens/routes/application',
    'canopsis/canopsis-rights/src/reopens/routes/userview',
    'canopsis/canopsis-rights/src/reopens/widgets/uimaintabcollection',
    'canopsis/canopsis-rights/src/reopens/adapters/userview',
    'canopsis/canopsis-rights/src/reopens/mixins/crud',
    'canopsis/canopsis-rights/src/reopens/mixins/showviewbutton',
    'ehbs!components/component-rightsselector',
    'ehbs!components/component-rights-action',
    'ehbs!components/component-rightsrenderer',
    'ehbs!components/component-right-checksum',
    'canopsis/canopsis-rights/src/components/rightsselector/component',
    'canopsis/canopsis-rights/src/components/rights-action/component',
    'canopsis/canopsis-rights/src/components/rightsrenderer/component',
    'canopsis/canopsis-rights/src/components/right-checksum/component',
    'ehbs!editor-rights',
    'ehbs!viewrightsform',
    'canopsis/canopsis-rights/src/forms/viewrightsform/controller',
    'ehbs!renderer-rights',
    'ehbs!rightschecksumbuttons',
    'ehbs!rightselector-itempartial',
    'ehbs!rightselector-selecteditempartial',
    'ehbs!actionbutton-viewrights'
], function () {});
