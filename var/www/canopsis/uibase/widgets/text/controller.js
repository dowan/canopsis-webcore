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

define([
    'jquery',
    'ember',
    'ember-data',
    'app/lib/factories/widget',
    'canopsis/canopsisConfiguration',
    'app/lib/utils/values',
    'app/controller/metric',
], function($, Ember, DS, WidgetFactory, canopsisConfiguration, values) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var widget = WidgetFactory('text', {

        needs: ['metric'],

        onSeriesFetch: function (caller, series) {

            /**
            Transform series information for widget text display facilities
            series are fetched from metric manager and are made of a list of metrics as
            [{meta: serieRecord, values: [[timestamp_0, value_0, [...]]]}, [...]]
            **/
            var length = series.length;

            for(var i=0; i<length; i++) {

                var values = get(series[i], 'values'),
                    serieName = get(series[i].meta, 'crecord_name').replace(/ /g,'_');

                var displayValue = __('No data available'),
                    valueLength = values.length;

                //choosing the value for the last point when any
                if (valueLength) {
                    displayValue = values[valueLength - 1][1];
                }

                //set values to reachable template place for user template combination
                set(caller, 'templateContext.serie.' + serieName, displayValue);
            }

            caller.setReady('serie');
        },

        init: function() {
            this._super.apply(this, arguments);
            set(this, 'widgetDataStore', DS.Store.create({
                container: get(this, "container")
            }));
            this.registerHelpers();
        },

        findItems: function() {

            //Contextual information for template compilation from user creation.
            Ember.setProperties(this, {
                'templateContext': Ember.Object.create({
                    serie: {},
                    event: {}
                }),
                'ready': {}
            });

            var now = new Date().getTime();
            var to = now;
            //fetch time window of 10 minutes hoping there are metrics since.
            var from = now - 600000;

            //When specific from / to dates specified into the controller,
            //the widget will use them. This helps manage live reporting.
            if (!isNone(get(this, 'from'))) {
                from = get(this, 'from');
            }
            if (!isNone(get(this, 'to'))) {
                to = get(this, 'to');
            }

            //This will trigger api queries for events and series in lasy philosophy.
            //If no contextual information set by user, no query is done.
            this.fetchEvents();

            var seriesMeta = get(this, 'series');
            if (!isNone(seriesMeta)) {
                get(this, 'controllers.metric').fetchSeriesFromSchemaValues(
                    this, get(this, 'widgetDataStore'), from, to, seriesMeta, this.onSeriesFetch
                );
            } else {
                this.setReady('serie');
            }

        },

        fetchEvents: function (){

            var controller = this,
                events_information = get(this, 'events'),
                rks = [];

            if (!isNone(events_information)) {
                var events_information_length = events_information.length;

                for(var i=0; i<events_information_length; i++) {
                    rks.push(events_information[i].rk);
                }
            }

            if (rks.length) {
                //Does the widget have to manage event information
                var event_query = get(this, "widgetDataStore").findQuery(
                    'event',
                    {
                        filter: JSON.stringify({_id: {'$in': rks}}),
                        limit: 50,
                    }
                ).then(function (data) {

                    console.log('Fetched events', data.content);

                    //Turn event information and labels to dictionnary for easy retreiving below
                    var labels_for_rk = {},
                        i;

                    for (i=0; i<events_information_length; i++) {

                        labels_for_rk[events_information[i].rk] = events_information[i].label;

                    }

                    //mapping between template context data and fetched events information from their labels
                    var length = data.content.length;
                    for (i=0; i<length; i++) {

                        var rk = get(data.content[i], 'id'),
                            label = labels_for_rk[rk].replace(/ /g,'_');
                            if (!isNone(label)) {
                                var eventjson = data.content[i].toJson();
                                eventjson.id = get(data.content[i], 'id');
                                set(controller, 'templateContext.event.' + label, eventjson);
                            } else {
                                console.warn('Event label not set, no render possible for rk ' + rk);
                            }

                    }

                    controller.setReady('event');

                });
            } else {
                controller.setReady('event');
            }
        },


        setReady: function (element) {
            set(this, 'ready.' + element, true);
            if (get(this, 'ready.serie') && get(this, 'ready.event')) {
                set(this, 'ready', {});
                this.renderTemplate();
            }
            console.log('widget ready', get(this, 'ready'), get(this, 'templateContext') );
        },

        registerHelpers: function (){
            var controller = this;
            var invalidNumber = __('Not a valid number');

            var helpers = {
                hr: function (value) {
                    console.log('found value for human readable : ', value);
                    var unit = get(value, 'hash.unit');
                    value = get(value, 'hash.value');
                    //only second option unit is available for now
                    //otherwise, values are considered as number base 10
                    if (unit !== 's') {
                        unit = '';
                    }

                    if(isNaN(value)) {
                        value = parseFloat(value);
                        if(isNaN(value)) {
                            return invalidNumber;
                        }
                    }
                    value = values.humanize(value, unit);
                    return value;
                },
                action: function () {
                    return 'action from helper';
                },
            };

            for (var helper in helpers) {
                Handlebars.registerHelper(helper, helpers[helper]);
            }
        },


        renderTemplate: function (){

            var template = get(this, 'html'),
                html = 'Unable to render template.';

            //Avoid give undefined template to the handlebars compilator.
            if (isNone(template)) {
                template = '';
            }

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
