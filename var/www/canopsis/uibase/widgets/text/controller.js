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
    'ember-data',
    'app/lib/factories/widget',
    'app/controller/serie',
    'canopsis/canopsisConfiguration',
    'app/lib/loaders/schemas',
    'app/controller/perfdata',
], function($, Ember, DS, WidgetFactory, Serie, canopsisConfiguration) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var TextViewMixin = Ember.Mixin.create({
        didInsertElement: function () {
            this._super.apply(this, arguments);
        },

        willDestroyElement: function () {
            this._super.apply(this, arguments);
        }
    });

    var widget = WidgetFactory('text', {

        needs: ['serie', 'perfdata'],

        viewMixins: [
            TextViewMixin
        ],

        perfdata: Ember.computed.alias('controllers.perfdata'),

        init: function() {
            this._super.apply(this, arguments);
            set(this, 'widgetDataStore', DS.Store.create({
                container: get(this, "container")
            }));
        },

        findItems: function() {

            set(this, 'templateContext', Ember.Object.create({
                serie: {},
            }));

            var ctrl = this;
            var seriesController = get(ctrl, 'controllers.serie');
            var series;

            var now = new Date().getTime();
            //fetch time window of 5 minutes hoping there are metrics since.
            var from = now - 300000;
            var to = now;

            //When specific from / to dates specified into the controller,
            //the widget will use them. This helps manage live reporting.
            if (!isNone(get(this, 'from'))) {
                from = get(this, 'from');
            }
            if (!isNone(get(this, 'to'))) {
                to = get(this, 'to');
            }


            var seriesValues = get(this, 'series');
            if (isNone(seriesValues)) {
                //Series crecord_name properties to query on object collection.
                seriesValues = [];
            }

            //Declared here for translation purposes
            var valueNotDefined = __('No data available');

            var seriesFilter = JSON.stringify({
                crecord_name: {'$in': seriesValues}
            });

            console.log('widget text series duration queries', from, to, now);
            get(this, 'widgetDataStore').findQuery(
                'serie',
                {filter: seriesFilter}
                ).then(function(results) {

                series = get(results, 'content');
                console.log('series records', series);

                var seriesQueries = [];
                for (var i=0; i<series.length; i++) {
                    seriesQueries.push(seriesController.fetch(
                        series[i],
                        from,
                        to
                    ));
                }

                console.log('seriesQueries', seriesQueries);

                Ember.RSVP.all(seriesQueries).then(function(pargs) {
                    for (var i=0; i<pargs.length; i++) {

                        var data = pargs[i];
                        console.log('series pargs', pargs);
                        var displayValue = valueNotDefined;
                        if (data.length) {
                            //choosing the value for the last point when any
                            displayValue = data[data.length - 1][1];
                        }
                        var serieName = get(series[i], 'crecord_name');
                        set(ctrl, 'templateContext.serie.' + serieName, displayValue);
                    }
                    ctrl.renderTemplate();
                });


            });

        },

        renderTemplate: function (){

            var template = get(this, 'html');

            var html = 'Unable to render template.';

            try {
                html = Handlebars.compile(template)(get(this, 'templateContext'));
            } catch (err) {
                html = '<i>An error occured while compiling the template with the record.' +
                ' please check if the template is correct</i>';
                if (canopsisConfiguration.DEBUG) {
                    html += '<p>' + err + '</p>';
                }
            }
            set(this, 'htmlRender', new Ember.Handlebars.SafeString(html));
        },

    });

    return widget;
});
