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
define(['ember' , "app/application"], function(Ember , Application) {


	Application.images = [];
	var folderPath = "/static/canopsis/media/images/";
	Application.images.nagios    = folderPath + 'nagioslogo.png';
	Application.images.shinken   = folderPath + 'shinkenlogo.png';
	Application.images.schneider = folderPath + 'schneiderlogo.png';
	Application.images.collectd  = folderPath + 'collectd.jpg';

	Ember.Handlebars.helper('logo', function(controller) {

		var  field = controller.attr.field;
		var  value = controller.record.content._data[field];
		var  logoPath = Canopsis.Application.images[value];

		if(logoPath !== undefined) {
			return new Ember.Handlebars.SafeString('<img alt="Source" src="'+ logoPath + '"/>');
		} else {
			return new Ember.Handlebars.SafeString(value);
		}
	});

	Ember.Handlebars.helper('logofromstring', function(imageName) {

		var  logoPath = Canopsis.Application.images[imageName];

		return new Ember.Handlebars.SafeString(logoPath);
	});

});