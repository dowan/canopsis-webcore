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

    Ember.Handlebars.helper('timeSince', function(timestamp , record) {

    if( timestamp || record.timeStampState ){
		var actuel = new Date().getTime();
		timestamp = record.timeStampState || timestamp;
		var a = new Date(timestamp * 1000);
		var time = diffDate(a, actuel, "d") - 1;

		var newObject = Ember.Object.create({value : time , field : "time" });
	  	newObject.addObserver('timeStampState',record, function(sender, key , value) {
			console.log("test");
		});
		var icon = '<span class=glyphicon glyphicon-time ></span>';
		if(time !== 0) {
			return new Ember.Handlebars.SafeString(__("Il y a ") + time + " " + __("jours"));
		}
			return new Ember.Handlebars.SafeString(__("Aujourd'hui"));
   	}
   	else{
   		return "";
   		}
    });

    //TODO : Move this function to "Application" Scope
    function diffDate(d1,d2,u) {
	div = 1;

	switch(u) {
	case 's':
	    div=1000;
	    break;
	case 'm':
	    div=1000*60;
	    break;
	case 'h':
	    div=1000*60*60;
	    break;
	case 'd':
	    div=1000*60*60*24;
	    break;
	default:
	    break;
	}

	var Diff = d2 - d1;
	return Math.ceil((Diff/div));
    }
});