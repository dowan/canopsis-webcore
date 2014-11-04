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

define(['text!../../rest/object/cservice/cservice.frontend', 'plugins'], function(frontendConfig, plugins_tool) {
    routes = [];

    frontendConfig = JSON.parse(frontendConfig);
    var enabledPlugins = JSON.stringify(frontendConfig.data[0].enabled_plugins);

    plugins_tool.Plugins.setEnabled('canopsis/', enabledPlugins);

    function load_(path) {
        var files;
        var plugins = [];

        plugins = plugins_tool.Plugins.getPlugins(path);
        plugins = plugins_tool.Plugins.resolveDependancies(plugins);

        var routes_plugins = plugins_tool.Manifest.fetchRoutes(plugins, path);
        routes = routes.concat(routes_plugins);
        files = plugins_tool.Manifest.fetchFiles(plugins, path);

        files = files.map(function(e) {
            return e.replace('canopsis/core/', 'app/');
        });

        require(files);
    }

    load_('canopsis/');
});

