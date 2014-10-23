#!/usr/bin/env node

var plugins = ['core', 'monitoring', 'uibase'];

// for (var i = 0; i < plugins.length; i++) {
//     plugins[i];
// }

var makeDeps = function(deps, requirementList) {
    var jsDeps = [];
    //generate deps
    for (var i = 0, l = requirementList.length; i < l; i++) {

        var requirementTemplate = requirementList[i].template;
        if(requirementTemplate) {
            deps.push('text!' + requirementList[i].template);
        }

        var requirementUrl = requirementList[i].url;
        if(requirementUrl) {
            jsDeps.push(requirementUrl);
        }
    }

    for (i = 0; i < jsDeps.length; i++) {
        deps.push(jsDeps[i]);
    }

    return deps;
};

loader = {
    loadWithTemplates: function(items) {
        var deps = ['ember'];
        var depsSize = deps.length;

        deps = makeDeps(deps, items);

        var res = 'define(' + JSON.stringify(deps) + ', function(Ember) {\n';
        res += '    var items ='+ JSON.stringify(items) +';\n';
        res += '    for (var i = 1, l = items.length, j = 1; i < l; i++, j++) {\n';
        res += '\n';
        res += '        if(items[i - 1].template !== undefined) {\n';
        res += '            var templateName = items[i - 1].name;\n';
        res += '\n';
        res += '            Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[j]);\n';
        res += '        } else {\n';
        res += '            j--;\n';
        res += '        }\n';
        res += '    }\n';
        res += '});\n';

        var fs = require('fs');
        fs.writeFile(file + '.build.js', res, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
        console.log(res);
        return res;
    }
};


file = './uibase/lib/loaders/components';
require(file);
file = './uibase/lib/loaders/editors';
require(file);
file = './uibase/lib/loaders/renderers';
require(file);
file = './uibase/lib/loaders/templates';
require(file);
file = './uibase/lib/loaders/widgets';
require(file);
file = './uibase/lib/loaders/widgets';
require(file);

file = './core/lib/loaders/components';
require(file);
file = './core/lib/loaders/mixins';
require(file);
