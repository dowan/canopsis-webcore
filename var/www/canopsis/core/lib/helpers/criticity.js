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

define(['moment', 'ember'], function(moment, Ember) {

	Ember.Handlebars.helper('criticityhelper', function(value) {
		if (value === 0) {
			return new Ember.Handlebars.SafeString('<span class="badge bg-green">Info</span>');
		} else if (value === 1) {
			return new Ember.Handlebars.SafeString('<span class="badge bg-yellow">Mineure</span>');
		} else if (value === 2) {
			return new Ember.Handlebars.SafeString('<span class="badge bg-orange">Majeure</span>');
		} else if (value === 3) {
			return new Ember.Handlebars.SafeString('<span class="badge bg-red">Critique</span>');
		} else if (value === 4) {
			return new Ember.Handlebars.SafeString('<span class="badge">Unknown</span>');
		}
	});

});
