 define([
    'app/application',
    'app/view/arraytocollectioncontrol'
], function(Application) {
    Application.TemplateView = Application.ArrayToCollectionControlView.extend({
        //cssClass: "btn-items-",
        init: function() {
            var contentREF = this.get("content")|| [];
            var attr = this.get("attr");
            var value = this.get("attr.value") || [];

            var classToGet = this.templateData.keywords.controller.content.model.options.templateClass;
            if(classToGet !== undefined) {
                for (var i=0 ; i < Canopsis.templates.byClass[classToGet].length ; i++) {
                    this.addTemplate(Canopsis.templates.byClass[classToGet][i], value, contentREF);
                }
            }
            else{
                for (var i=0 ; i < Canopsis.templates.all.length ; i++) {
                    this.addTemplate(Canopsis.templates.all[i], value, contentREF);
                }
            }

            //Have to be done after
            this.set("attr.value" , value);
            this.set("value" , value);

            this.set("content" , contentREF);
            this._super(true);
        }
    });
    return Application.TemplateView;
});
