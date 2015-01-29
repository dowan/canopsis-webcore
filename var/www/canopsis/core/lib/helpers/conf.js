/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
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

define(['ember' , 'utils'], function(Ember , utils) {

    Ember.Handlebars.helper('conf', function( controller ) {
        function convertDictToArray(dict) {
            var fieldsArray = Ember.A();
            for (var attr in dict){
                if (dict.hasOwnProperty(attr)) {
                    var newObject = Ember.Object.create({value : dict[attr] , field : attr });
                    fieldsArray.pushObject(newObject);
                    console.log ( "Added "+ attr + " = " + dict[attr] +" newObject = " + newObject[attr]);
                }
            }
            return fieldsArray;
        };

        var options_filter =  this.record.get("options_filter");
        var options_filter_string = Ember.A();
        options_filter.filter(function(element){
            options_filter_string.pushObject(element.name);
        });

        var options = utils.filterObject.getFieldsByPrefix( "_opt_" , this.record.content , function( attr , result ,record ){
            var field = attr.slice(5);
            if ( options_filter_string.contains ( field )){
                var value = record.get( attr );
                var option = Ember.Object.create({ value : value , field : field });
                result.pushObject( option );
            }
        });

        var returnValue = "";
        options.forEach(function(x){
            var start     = "<div>";
            var end     = "</div>";

            returnValue += start + x.field + " : " + x.value + end ;
        });
        return new Ember.Handlebars.SafeString( returnValue );
    });

});
