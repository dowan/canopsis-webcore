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

var forms = [
    { name: 'modelform', url: 'app/forms/modelform/controller', template: 'app/forms/modelform/template.html' },
    { name: 'widgetform', url: 'app/forms/widgetform/controller', template: 'app/forms/widgetform/template.html' },
    { name: 'arrayitemform', url: 'app/forms/arrayitemform/controller', template: 'app/forms/arrayitemform/template.html' },
    { name: 'jobform', url: 'app/forms/jobform/controller', template: 'app/forms/jobform/template.html' },
    { name: 'taskform', url: 'app/forms/taskform/controller', template: 'app/forms/taskform/template.html' },
    { name: 'scheduleform', url: 'app/forms/scheduleform/controller', template: 'app/forms/scheduleform/template.html' },
    { name: 'confirmform', url: 'app/forms/confirmform/controller', template: 'app/forms/confirmform/template.html' }
];

loader.loadWithTemplates(forms);
