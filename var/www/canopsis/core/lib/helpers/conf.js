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

	Ember.Handlebars.helper('conf', function( controller ) {
		var record = this.record;
		var data = record.content._data;

		var returnValue = "";
		var options = [];
		//debugger;
		for ( var attr in data ){
			if ( data.hasOwnProperty( attr ) ){
				if( attr.indexOf("_opt_") > -1){
					var field = attr.slice(5);
					if ( data.options_filter.contains ( field )){
						var value = record.get( attr );
						var option = Ember.Object.create({ value : value , field : field });
						options.pushObject( option );
					}
				}
			}
		}
		options.forEach(function(x){
		    var start 	= "<div>";
		    var end 	= "</div>";

		    returnValue += start + x.field + " : " + x.value + end ;
		});
		// debugger;
		return new Ember.Handlebars.SafeString( returnValue );
	});

});