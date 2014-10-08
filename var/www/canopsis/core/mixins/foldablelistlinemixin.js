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
                    debugger;
                    console.warn('unfold');
                    var value = !record.content.get("unfolded");
                    Ember.set(record.content,"unfolded", value);
                    if(!record.content.loaded)
                        this.ajaxCall(record);
                }
            },

            ajaxCall :function(record  , params){
                // action must be take in count here
                params = params || "";
               // var id = record.content.get("id");
                //{"event_type":"eue","uniqueKey":"892af02377233e5ec34f32951f450c6b","type_message":"step"}
                // filter : even_type: eue , uniqueKey; $uniqueKey , type_message:"step"
                var uniqueKey = record.content._data.uniqueKey;
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
                var record = args[0];
                var line_controller = record;

                var nmbr_colonne = this.get("nmbr_colonne");
                var shown_columns = this.get('shown_columns');
                var step_template = this.get('step_template');

                if (step_template)
                {
                    Ember.set(line_controller.content, "steps", response.data);
                    Ember.set(line_controller, "steps", response.data);
                    Ember.set(this, "steps", response.data);

                   // var step_template_cel = step_template.slice(43, length - 16);
                   debugger;
                    step_template_cel = step_template.replace('<tr>','<tr style="font-weight:initial; text-align:left;">');
                    var template_columns ="";

                    var columns = this.params_from_template(step_template_cel);
                    for (var i=0; i<columns.length ; i++){
                        var column = columns[i];
                        template_columns += '<td style="background-color: papayawhip;">' + column +'</td>';
                    }

                    template_columns = template_columns;

                    var source  = '<th COLSPAN=2></th><th COLSPAN='+ nmbr_colonne +'><table class="table table-bordered"><tbody>' + template_columns + step_template + '</tbody></table></th>';

                   // var source = '<td> hello</td>';
                    var html = Ember.Handlebars.compile(source);

                    Ember.set(Ember.TEMPLATES, "testTemplate", html);


                    Ember.set(record.content,"loaded",true);
                }
                else
                {
                   // Ember.set(record,'loaded',true);
                    nmbr_colonne+= 2;
                    Ember.set(record,'html','<th COLSPAN=' + nmbr_colonne + '>No template was found</th>');
                }
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
                    if (param.indexOf("each") == -1){
                        var endOfWord = param.indexOf(" ");
                        if (endOfWord != -1){
                            debugger;
                            var firstWord = param.slice(0, endOfWord);
                            result.push(firstWord);
                        }
                        else
                        {
                            result.push(param);
                        }
                    }
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

        testTemplate :function(){
         //   debugger;
            return "testTemplate";
        },
        nmbr_colonne: function(){
          //  debugger;
            var shown_columns = this.get("shown_columns");
            var nmbr_colonne = (shown_columns)? shown_columns.length : 0;

            return nmbr_colonne;
        }.property()
    });


    Application.FoldablelistlineMixin = mixin;

    return mixin;
});
