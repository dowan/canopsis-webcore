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
        'jobform': 'canopsis/canopsis-ui/src/forms/jobform/jobform',

    }
});

 define([
    'canopsis/canopsis-ui/src/forms/jobform/controller',
    'ehbs!jobform',
    'canopsis/canopsis-ui/src/forms/scheduleform/controller',
    'canopsis/canopsis-ui/src/forms/taskform/controller',
    'canopsis/canopsis-ui/src/reopens/views/application',
    'canopsis/canopsis-ui/requirejs-modules/externals.conf'
], function () {});
