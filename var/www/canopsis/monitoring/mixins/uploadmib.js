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
    'ember',
    'app/lib/factories/mixin'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set;

    var viewMixin = Ember.Mixin.create({

        didInsertElement: function() {
            this._super();
            window.$U = this;
            //this.$('#files')[0].addEventListener('change', this.handleFileSelect, false);
            this.$('#files').change(
                {uploadmibMixin: this},
                this.handleFileSelect
            );
        },

        onFileLoaded: function (filecontent, uploadmibMixin) {
            var adapter = getCanopsis().Application.__container__.lookup('adapter:snmpmib');

            adapter.uploadmib(
                'uploadmib',
                {'filecontent': JSON.stringify(filecontent)}
            ).then(function(results) {

                console.log('uploaded mib', results);

                var controller = get(uploadmibMixin, 'controller');

                set(controller, 'message', results.data[0].msg);

                errors = results.data[0].data;
                if (errors.length) {
                    set(controller, 'alertlevel', 'alert-danger');
                } else {
                    set(controller, 'alertlevel', 'alert-info');
                }
                set(controller, 'uploadErrors', errors);
                //hide message ten seconds later
                setTimeout(function () {
                    set(controller, 'message', '');
                }, 10000);

            });

        },

        handleFileSelect: function(evt) {

            var files = evt.target.files; // FileList object
            var uploadmibMixin = get(evt, 'data.uploadmibMixin');

            // files is a FileList of File objects. List some properties.
            var content = [];
            for (var i=0; i<files.length; i++) {
                var file = files[i];
                // Closure to capture the file information.
                var reader = new FileReader();
                reader.onload = (function(file) {
                    return function(e) {
                        content.push({
                            filename: escape(file.name),
                            data: e.target.result
                        });
                    };
                })(file);
                // Read in the image file as a data URL.
                reader.readAsText(file);
            }
            var filesReady = function () {
                console.log('Test files ready');
                if (files.length === content.length) {
                    console.log(content);
                    uploadmibMixin.onFileLoaded(content, uploadmibMixin);
                } else {
                    console.log('waiting for file load ready');
                    setTimeout(filesReady, 500);
                }
            };
            filesReady();

        }


    });

    var mixin = Mixin('uploadmib', {
        partials: {
            actionToolbarButtons: ['actionbutton-uploadmib']
        },

        init: function() {
            this._super();
            this.addMixinView(viewMixin);
        }
    });


    return mixin;
});
