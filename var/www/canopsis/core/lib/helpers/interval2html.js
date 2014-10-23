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

define(['ember', 'app/lib/utils/dates'], function(Ember, datesUtils) {

    var set = Ember.set,
        isNone = Ember.isNone;


    Ember.Handlebars.helper('interval2html', function(from , to) {

        var html = '';//'<div style="min-width:200px"></div>';

        if(!isNone(from)) {
            html += __('From') + ' ' + datesUtils.timestamp2String(from);
        }

        if(!isNone(from) && !isNone(to)) {
            html += ' ';
        }

        if(!isNone(to)) {
            html += __('to') + ' ' + datesUtils.timestamp2String(to);
        }

        console.debug('generated html form interval2html is', html);

        return html;
    });

});
