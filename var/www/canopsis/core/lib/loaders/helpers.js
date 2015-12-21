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

var helpers = [
    { name:'formview', url:'canopsis/core/lib/helpers/formview' },
    { name:'getfield', url:'canopsis/core/lib/helpers/getfield' },
    { name:'i18n', url:'canopsis/core/lib/helpers/i18n' },
    { name:'log', url:'canopsis/core/lib/helpers/log' },
    { name:'partialslot', url:'canopsis/core/lib/helpers/partialslot' },
    { name:'renderwidget', url:'canopsis/core/lib/helpers/renderwidget' },
    { name:'validationtextarea', url:'canopsis/core/lib/helpers/validationtextarea' },
    { name:'validationtextfield', url:'canopsis/core/lib/helpers/validationtextfield' },
    { name:'widgetslot', url:'canopsis/core/lib/helpers/widgetslot' },
];

loader.loadWithTemplates(helpers);
