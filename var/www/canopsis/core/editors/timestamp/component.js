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


define([
	'ember',
	'app/application',
    'utils'
], function(Ember, Application, utils) {

	var get = Ember.get,
	    set = Ember.set;

	Application.ComponentTimestampComponent = Ember.Component.extend({
		init: function () {
			this._super.apply(this, arguments);
            set(this, 'id', utils.hash.generate_GUID());
		},

        didInsertElement: function (){
            //@doc http://eonasdan.github.io/bootstrap-datetimepicker/
            var timepicker = $('#' + get(this, 'id'));

            var timepickerComponent = this;

            timepicker.datetimepicker({
                useSeconds: true, //en/disables the seconds picker
                useCurrent: true, //when true, picker will set the value to the current date/time
                language: 'fr'
            });
            console.log('timestamp dom init complete');

            timepicker.on("dp.change",function (e) {
                var timestamp = new Date(e.date).getTime() / 1000;
                set(timepickerComponent, 'content', timestamp);
                console.log('timestamp date set', timestamp);
            });
        }
    });

	return Application.ComponentTimestampComponent;
});
