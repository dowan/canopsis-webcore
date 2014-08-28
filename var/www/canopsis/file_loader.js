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

var routes;

require([
	'plugins',
	'text!/plugins/enabled.json',
	'text!/plugins/uibase/files/manifest.json',
	'text!/plugins/uibase/files/routes.json',
	'text!/plugins/uibase/files/files.json',
	'text!canopsis/core/files/manifest.json',
	'text!canopsis/core/files/routes.json',
	'text!canopsis/core/files/files.json'
], function(plugins_tool) {

	function load_core(){
		var path_core = "canopsis/"
		var core_path_ = "text!canopsis/core/files/manifest.json";
		var core = (JSON.parse(require(core_path_))).flatten();

		routes = plugins_tool.Manifest.fetchRoutes([core], "canopsis/");
		var files_core = plugins_tool.Manifest.fetchFiles([core], "canopsis/");
		files_core = files_core.map(function(e) {
			return e.replace("canopsis/core/", "app/");
		});

		require(files_core);
	}

	function load_plugins(){
		var files;
		var plugins = [];
		var path = "/plugins/";

		try {
			plugins = plugins_tool.Plugins.getPlugins(path);
			plugins = plugins_tool.Plugins.resolveDependancies(plugins);
		} catch (e) {
			console.log("PluginError: " + e);
		}

		routes_plugins = plugins_tool.Manifest.fetchRoutes(plugins, path);
		routes = routes.concat(routes_plugins);
		files = plugins_tool.Manifest.fetchFiles(plugins, path);
		require(files);
	}

	load_core();
	load_plugins();
});