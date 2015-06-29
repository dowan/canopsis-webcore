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


//TODO implement auto check for mvct file existence and require them automatically

var components = [
    { name: 'components/component-editor', template: 'app/src/components/editor/template.html' },
    { name: 'components/component-renderer', template: 'app/src/components/renderer/template.html' },
    { name: 'components/component-wrapper', template: 'app/src/components/wrapper/template.html' },
    { name: 'modelform', template: 'app/src/forms/modelform/template.html' },
    { name: 'widgetform', template: 'app/src/forms/widgetform/template.html' },
    { name: 'confirmform', template: 'app/src/forms/confirmform/template.html' },
    { name: 'viewtreeform', template: 'app/src/forms/viewtreeform/template.html' }
];

loader.loadWithTemplates(components);
