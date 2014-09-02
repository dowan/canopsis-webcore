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
	'jquery',
	'ember',
	'app/application',
	'utils',
	'jquery.encoding.digests.sha1'
], function($, Ember, Application, utils) {
	Application.LoginRoute = Ember.Route.extend({
		setupController: function(controller, model) {
			void(model);

			controller.reset();
			//prevents from getting a string into the authkey
		}
	});

	Application.LoginController = Ember.ObjectController.extend({
		content: {},

		getUser: function () {
			var controller = this;

			$.ajax({
				url: '/account/me',
				data: {limit: 1000},
				success: function(data) {
					console.log("got user", data);

					var account = data.data[0];

					controller.set('username', account.user);
					controller.set('group', account.aaa_group.slice('group.'.length));

					var groups = [];

					for(var i = 0; i < account.groups.length; i++) {
						groups.push(account.groups[i].slice('group.'.length));
					}

					controller.set('groups', groups);
					controller.set('rights', account.rights);
					controller.set('mail', account.mail);
					controller.set('authkey', account.authkey);

					utils.session = controller;
				},
				async: false
			});

		},
		username: function () {
		}.property(),

		reset: function() {
			this.setProperties({
				username: "",
				password: "",
				shadow: "",
				cryptedkey: "",
				authkey: this.get('authkey')
			});
		},

		authkey: function () {
			var authkey = localStorage.cps_authkey;
			if (authkey === 'undefined') {
				authkey = undefined;
			}
			return authkey;
		}.property('authkey'),

		authkeyChanged: function() {
			localStorage.cps_authkey = this.get('authkey');
		}.observes('authkey')
	});

	return Application.LoginController;
});