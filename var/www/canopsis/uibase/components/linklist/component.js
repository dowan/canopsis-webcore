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
    name:"component-linklist",
    after: 'EntitylinkAdapter',
    initialize: function(container, application) {
        var adapter = container.lookup('adapter:entitylink');

        var get = Ember.get,
            set = Ember.set,
            isNone = Ember.isNone,
            __ = Ember.String.loc;

        /**
        This component loads labelled links information from entity link backend and make them
        available in the link list button.
        **/

        var component = Ember.Component.extend({

            //events link that may exist in the entitylink payload where to look for labelled urls
            link_types: ['computed_links', 'event_links'],

            init: function() {
                this._super();
                set(this, 'links', Ember.A());
            },

            didInsertElement: function () {
                //allow display for button onclick menu display.
                //otherwise the menu is locked into the table td element.
                console.log('Inserted element linklist, setting td parent overflow to visible');
                this.$().parents('td').css('overflow-x', 'visible').css('overflow-y', 'visible');
                this.loadLinks();
            },

            linksFromApi: function (evt) {
                /**
                Query the entity link storage in order to find a link list from an event.
                **/
                var linklistComponent = this;

                console.log('event', evt);

                //Do query entity link api
                adapter.findEventLinks(
                    'entitylink',
                    {'event': JSON.stringify(evt)}
                ).then(function(results) {

                    console.log('links from api results', results);
                    var links = [],
                        link_types = linklistComponent.link_types;

                    if (results.success) {
                        //when links found, make them available in the links array of the component
                        var data = results.data;
                        if (data.length) {

                            var links_information = data[0];
                            console.log('links_information', links_information);

                            //merge all optional data fields that may contain labelled links
                            var types_length = link_types.length;
                            for (var i=0; i<types_length; i++) {

                                var value = links_information[link_types[i]];
                                console.log('search',link_types[i], 'in links_information', value);

                                if (!isNone(value) && Ember.isArray(value)) {
                                    var len = value.length;
                                    for (var j=0; j<len; j++) {
                                        //Compute handlebars url if any
                                        value[j].url = linklistComponent.compute_url(evt, value[j].url);
                                        get(linklistComponent, 'links').pushObject(value[j]);
                                    }
                                }
                            }
                        }

                    }
                });
            },

            compute_url: function(context, template) {

                var compiledUrl = Handlebars.compile(template)(context);
                console.log('handlebars url', compiledUrl, context);
                return compiledUrl;

            },


            loadLinks: function() {

                /**
                Initialization of the api query from an event.
                Data are cached, when already fetched, they are not reloaded.
                **/

                if (!get(this, 'loaded')) {

                    var evt = get(this, 'record').toJson();
                    console.log('loading links for event', evt);
                    this.linksFromApi(evt);

                    set(this, 'loaded', true);
                } else {
                    console.log('Links already loaded');
                }

            }

        });

        application.register('component:component-linklist', component);
    }
});
