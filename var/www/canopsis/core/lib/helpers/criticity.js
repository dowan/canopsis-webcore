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

define(['ember'], function(Ember) {
	Ember.Handlebars.helper('criticity', function(value, crecord) {

		var span;

		//displays keep status information if any onto the state field
		//keep state is generated when a user overrides the criticity of and acknowleged event
		var record;
		//Very bad way to access keep_state information ,but doesn't work with usual getters
		//TODO refactor
		if (crecord.contexts && crecord.contexts[0] && crecord.contexts[0].record) {
			record = crecord.contexts[0].record;
		}
		if (record) {

			color = '';
			switch(value) {
				case 0: color = 'bg-green'; break;
				case 1: color = 'bg-yellow'; break;
				case 2: color = 'bg-orange'; break;
				case 3: color = 'bg-red'; break;
			}

			record = record.get('content');
			display_keep_state = '';
			if (record._data && record._data.keep_state) {
				display_keep_state = '<span class="badge '+ color +'"><i class="fa fa-male"></i></span>';
			}
		}


		switch(value) {
			case 0: span = '<span class="badge bg-green">Info</span>'; break;
			case 1: span = '<span class="badge bg-yellow">Mineure</span>'; break;
			case 2: span = '<span class="badge bg-orange">Majeure</span>'; break;
			case 3: span = '<span class="badge bg-red">Critique</span>'; break;
			case 4: span = '<span class="badge">Unknown</span>'; break;
		}
		return new Ember.Handlebars.SafeString(span + display_keep_state);

	});

});
