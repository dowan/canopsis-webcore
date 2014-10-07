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
    'app/application',
    'app/lib/formsregistry'
], function($, Ember, Application, formsregistry) {

    var mixin = Ember.Mixin.create({
            actions: {
                unfold_action:function(record){
                    console.warn('unfold');
                    var value = !record.get("unfolded");
                    Ember.set(record,"unfolded", value);
                    if(!record.loaded)
                        this.ajaxCall(record);
                }
            },

            ajaxCall :function(record  , params){
                // action must be take in count here
                params = params || "";
                var id = record.get("id");
                //{"event_type":"eue","uniqueKey":"892af02377233e5ec34f32951f450c6b","type_message":"step"}
                // filter : even_type: eue , uniqueKey; $uniqueKey , type_message:"step"
                var uniqueKey = record._data.uniqueKey;
                var url = '/rest/events?filter={"$and":[{"$or":[{"event_type":"eue","uniqueKey":"'+uniqueKey+'","type_message":"step"}]},{}]}';

                var ajaxDeffered = $.ajax({ url: url,
                    context: this,
                    success: this.ajaxSuccess,
                    error: this.ajaxError
                })
                ajaxDeffered.args = arguments;
                    //ajaxDeffered.ajaxanswer = ajaxanswer;
            },


            ajaxSuccess: function(response , textStatus, deffered){
                var args = deffered.args;
            //    var action = args[0];
                var record = args[0];


                var nmbr_colonne = this.get("nmbr_colonne");
                var shown_columns = this.get('shown_columns');
                var step_template = this.get('step_template');

                var class_unused='style="background-color:white"; COLSPAN=2"';
                var cltd='style="background-color:beige"';
               // var source ='{{#steps}}<tr><th '+class_unused+'></th><td '+ cltd +'>{{event_type}}</td><td '+cltd+'>{{output}}</td><td '+cltd+'>{{connector}}</td></tr>{{/steps}}';
                var columns = "";
              //  var entete = '<tr>{{#shown_columns}}<th>{{field}}</th>{{/shown_columns}}</tr>';
                for ( var i=0; i<shown_columns.length ; i++){
                    var column = shown_columns[i].field;
                    columns += '<td '+cltd+'>{{'+ column +'}}</td>';
                  //  "<td '+ cltd +'>{{event_type}}</td><td '+cltd+'>{{output}}</td><td '+cltd+'>{{connector}}</td>"
                }
                //var source ='{{#steps}}<tr><th '+class_unused+'>'+ columns +'</th></tr>{{/steps}}';
              //  var source = '{{#steps}}<tr><th '+class_unused+'><th ' + step_template +'</th></tr>{{/steps}}';
               // var source = '{{#steps}}<tr><th '+class_unused+'><td>{{output}}</td></tr>{{/steps}}';
               // var source = '<th COLSPAN=10>{{#steps}}<table class="table table-bordered"><tbody><tr><td>{{output}}</td></tr></tbody></table>{{/steps}}</th>';
               // var source = '<th COLSPAN=10>{{#steps}}' + step_template + '{{/steps}}</th>';
                var length = step_template.length;
                var step_template_cel = step_template.slice(43, length - 16);
                step_template_cel = step_template_cel.replace('<tr>','<tr style="font-weight:initial; text-align:left;">');
                var columns = this.params_from_template(step_template_cel);

                var template_columns = "";

                for (var i=0; i<columns.length ; i++){
                    var column = columns[i];
                    template_columns += '<td style="background-color: papayawhip;">' + column +'</td>';
                  //  "<td '+ cltd +'>{{event_type}}</td><td '+cltd+'>{{output}}</td><td '+cltd+'>{{connector}}</td>"
                }

                template_columns = '<th COLSPAN=2></th><th COLSPAN=9><table class="table table-bordered"><tbody>' + template_columns;
               // var source = template_columns + '<th COLSPAN=10><table class="table table-bordered">{{#steps}}' + step_template_cel + '{{/steps}}</table></th>';
                var source = '{{#steps}}' + step_template_cel + '{{/steps}}</th>';

                var template = Handlebars.compile(source);
                var context = {steps:response.data , shown_columns:shown_columns};
                var html    = template(context);

                template_columns += html + '</tbody></table></th>' ;
                Ember.set(record,"loaded",true);
                Ember.set(record,"html",template_columns);
            },

            ajaxError: function(response ,textStatus, deffered){
                var callbackName = "";
                var tesData;
                $( "#toremove" ).remove();
            //  var ajaxanswer = response.ajaxanswer ;
                var responseText = response.responseText;
                var html = $.parseHTML( responseText );
                var errorNode = html[9];
                var errorMessage = errorNode.innerText;
                Canopsis.ajaxanswer.set("message" , errorMessage);

                //$(".modal-body").append( errorNode );
            },

        params_from_template: function(str){
            var start = 0;
            var end = 0;
            var result = [];

            while (start != -1){
                start = str.search("{{");
                if (start != -1){
                    end = str.search("}}");
                    var param = str.slice(start + 2, end);
                    result.push(param);
                    str = str.slice(end + 2);
                }
            }
            return result;
        },

        partials: {
            testou:["actionbutton-foldable"]
        },

        colonne_header: {
            testou:["plus-sign"]
        },

        nmbr_colonne: function(){
            //debugger;
            return 13;
        }.property()
    });


    Application.FoldablelistlineMixin = mixin;

    return mixin;
});
