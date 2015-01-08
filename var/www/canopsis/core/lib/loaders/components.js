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


//TODO implement auto check for mvct file existence and require them automatically

var components = [
    { name: 'components/component-editor', url: 'app/components/editor/component', template: 'app/components/editor/template.html' },
    { name: 'components/component-renderer', url: 'app/components/renderer/component', template: 'app/components/renderer/template.html' },
    { name: 'components/component-wrapper', url: 'app/components/wrapper/component', template: 'app/components/wrapper/template.html' },
    { name: 'components/component-attributepreset', url: 'app/components/attributepreset/component', template: 'app/components/attributepreset/template.html' },
    { name: 'components/component-texttodict', url: 'app/components/texttodict/component', template: 'app/components/texttodict/template.html' }
];

loader.loadWithTemplates(components);
