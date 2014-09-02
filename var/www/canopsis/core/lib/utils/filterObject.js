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

define(['app/application'], function(Application) {

	var filterObjectUtils = {
		getFieldsByPrefix: function( prefix , record, callback , contentREF , _self  ) {
			var resultISString =  typeof (contentREF) === "string" ;
			var result = ( resultISString )? contentREF :  contentREF || Ember.A();
			var ctype = record.get("crecord_type") || record.get("connector_type");
			var Stringtype = ctype.charAt(0).toUpperCase() + ctype.slice(1);
			var model = Canopsis.Application.allModels[Stringtype];

			for ( var attr in model ){
				if ( model.hasOwnProperty( attr ) ){
					if( attr.indexOf(prefix) > -1){
						if ( resultISString )
							result = callback( attr , result , record , model , _self);
						else
							callback( attr , result , record , model , _self);
					}
				}
			}
		return result;
		}
	}
	return filterObjectUtils;
});