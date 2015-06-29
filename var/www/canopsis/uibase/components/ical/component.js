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



Ember.Application.initializer({
    name:"component-rrule",
    initialize: function(container, application) {
        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone,
             __ = Ember.String.loc;

        var component = Ember.Component.extend({

            //translated by tooltip
            helpFrequency: 'How often the rule is applied',
            helpRepetitionInterval: 'Time space between two repetitions',
            helpRepetitionCount: 'How many times action is repeated',
            helpStartDate: 'Since when to apply rule',
            helpStopDate: 'Until when to apply rule',


            frequencyForm: [
                {value: RRule.YEARLY, label: __('Yearly')},
                {value: RRule.MONTHLY, label: __('Monthly')},
                {value: RRule.WEEKLY, label: __('Weekly')},
                {value: RRule.DAILY, label: __('Daily')},
                {value: RRule.HOURLY, label: __('Hourly')},
                {value: RRule.MINUTELY, label: __('Minutely')},
                {value: RRule.SECONDLY, label: __('Secondly')},
            ],

            /*//not used yet
            months: [
                {id: 1, label: __('jan')},
                {id: 2, label: __('feb')},
                {id: 3, label: __('mar')},
                {id: 4, label: __('apr')},
                {id: 5, label: __('may')},
                {id: 6, label: __('jun')},
                {id: 7, label: __('jul')},
                {id: 8, label: __('aug')},
                {id: 9, label: __('sep')},
                {id: 10, label: __('oct')},
                {id: 11, label: __('nov')},
                {id: 12, label: __('dec')},
            ],

            proxiedMonth: Ember.computed.map('model', function(model){
                return Ember.ObjectProxy.create({
                  content: model,
                  checked: false
                });
            }),
            */

            init: function() {
                this._super();

                var monthmodel = DS.Model.extend({
                  label: DS.attr()
                });

                monthmodel.FIXTURES = get(this,'months');

                set(this, 'rules', []);
                set(this, 'frequencySelection', RRule.YEARLY);

                console.log('rrule information', get(this, 'frequencyForm'));

                //initialization from existing rrules content
                var content = get(this, 'content');
                if (!isNone(content) && Ember.isArray(content)) {
                    var contentlen = content.length;
                    for (var i=0; i< contentlen; i++) {
                        try {
                            var rule = RRule.fromString(content[i]);
                            var ruleObject = {value: rule.toText(), instance: rule};
                            get(this, 'rules').pushObject(ruleObject);
                        } catch (err) {
                            //error appends half the time form lib i dont know why
                            console.warn('Unable to parse rrule from given information', content[i], err);
                        }
                    }
                } else {
                    console.log('no content available for initialization');
                }
                this.updateContent();


            },

            actions: {

                removeRule: function (rule) {
                    get(this, 'rules').removeObject(rule);
                    this.updateContent();
                },

                addRule: function () {

                    //Generating rrule options
                    var rrule = {};

                    var startDate = get(this, 'startDate');
                    if (!isNone(startDate) && !isNaN(startDate)) {
                        rrule.dtstart = new Date(startDate * 1000);
                    }

                    var stopDate = get(this, 'stopDate');
                    if (!isNone(stopDate) && !isNaN(stopDate)) {
                        rrule.until = new Date(stopDate * 1000);
                    }

                    var repetitionCount = get(this, 'repetitionCount');
                    if (!isNone(repetitionCount) && !isNaN(repetitionCount)) {
                        rrule.count = parseInt(repetitionCount);
                    }

                    var repetitionInterval = get(this, 'repetitionInterval');
                    if (!isNone(repetitionInterval) && !isNaN(repetitionInterval)) {
                        rrule.interval = parseInt(repetitionInterval);
                    } else {
                        //is set at least by default to 30
                        console.log('rrule inteval default value set to 30 as no value set');
                        rrule.interval = 30;
                    }

                    var frequencySelection = get(this, 'frequencySelection');
                    console.log('generated rrule options',  rrule, 'frequencySelection ', frequencySelection );
                    var rruleInstance =new RRule(frequencySelection, rrule);

                    var ruleObject = {value: rruleInstance.toText(), instance: rruleInstance};

                    get(this, 'rules').pushObject(ruleObject);

                   this.updateContent();
                }
            },

            updateContent: function () {
                var content = [];
                var rules = get(this,'rules');
                var ruleslen = rules.length;
                for (var i=0; i<ruleslen; i++) {
                    content.push(rules[i].instance.toString());
                }

                console.log('generated rules', content);
                set(this, 'content', content);
            },

            didInsertElement:function () {
                console.log('recurrence input loaded', this.$());
            },

        });

        application.register('component:component-rrule', component);
    }
});
