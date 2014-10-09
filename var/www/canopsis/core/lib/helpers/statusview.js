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

define(['ember', 'utils'], function(Ember, utils) {

    Ember.Handlebars.helper('statusview', function(status, crecord) {
        /**
            # status legend:
            # 0 == Ok
            # 1 == On going
            # 2 == Stealthy
            # 3 == Bagot
            # 4 == Canceled
        **/

        var statuses = {
            0: 'Off',
            1: 'On going',
            2: 'Stealthy',
            3: 'Bagot',
            4: 'Cancelled',
        };
        status = status || Ember.get(crecord, "status");
        crecord.statusvalue = __(statuses[status]);

        if(status === 4) {
            //displays cancel information if any onto the status field
            var value = crecord.get('record.cancel');
            if(!Ember.isNone(value.timestamp)) {
                crecord.statushtml = [
                    '<center>',
                    '<i>' , __('Date') , '</i> : <br/>',
                    utils.dates.timestamp2String(value.timestamp) ,' <br/> ',
                    __('By'), ' : ' , value.author ,' <br/><br/> ',
                    '<i>', __('Comment') ,'</i> : <br/>' , value.comment,
                    '</center>'
                ].join('');
            }

        }
        return "";
    });

});
