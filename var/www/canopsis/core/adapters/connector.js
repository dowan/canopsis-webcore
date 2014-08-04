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

//TODO: Use EntityAdapter to retrieve ACK

define([
	'app/application',
	'app/adapters/application',
	'app/serializers/ack'
], function(Application, ApplicationAdapter) {
	var adapter = ApplicationAdapter.extend({


		find: function(store, type, id) {
			console.log('find', arguments);
			return this.findQuery (store, type, { filter: { rk: id, solved : false }, sort: {timestamp:1}, limit:1 });
		},

		findQuery: function(store, type, query) {
			var toADD = "";
			var first = "";
			query["multi"] = ["nagios" , "connector","shinken", "collectd", "schneider"];
			for ( var item in query ){
				if ( query.hasOwnProperty(item)) {
					toADD += first + item + "=" + query[item];
					first="&";
				}
			}
			return this.ajax('/rest/object/connector?'+toADD, 'GET');
		}
	});

	Application.ConnectorAdapter = adapter;

	return adapter;
});