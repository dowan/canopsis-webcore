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
	Ember.Handlebars.helper('criticity', function(value) {

		var span;

		switch(value) {
			case 0: span = '<span class="badge bg-green">Info</span>'; break;
			case 1: span = '<span class="badge bg-yellow">Mineure</span>'; break;
			case 2: span = '<span class="badge bg-orange">Majeure</span>'; break;
			case 3: span = '<span class="badge bg-red">Critique</span>'; break;
			case 4: span = '<span class="badge">Unknown</span>'; break;
		}
		return new Ember.Handlebars.SafeString(span);

	});

});
