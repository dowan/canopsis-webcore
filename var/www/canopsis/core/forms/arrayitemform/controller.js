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
	'app/lib/factories/form',
	'app/lib/utils/forms',
	'app/lib/loaders/schema-manager',
	'app/controller/journal'
], function(Ember, Application, FormFactory, formUtils) {
	var get = Ember.get,
		set = Ember.set;

	FormFactory('arrayitemform', {
		needs: ['journal'],

		title: "configure arrayitem",

		init: function() {
			set(this, 'previousForm', get(this, 'formParent'));

			this._super.apply(this, arguments);
		},

		actions: {
			previousForm: function() {
				console.log('previousForm', get(this, 'previousForm'), this);
				formUtils.showInstance(get(this, 'previousForm'));
			}
		},

		parentContainerWidget: Ember.required(),
		parentUserview: Ember.required()
	});

	return Application.WidgetformController;
});
