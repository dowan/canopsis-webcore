define([
    'jquery',
    'app/lib/factories/widget',
    'app/mixins/foldablelistlinemixin',
    'canopsis/uibase/widgets/list/controller'
], function($, WidgetFactory , FoldableListLineMixin , ListController) {
    var get = Ember.get;
    var listOptions = {
        mixins: [
            FoldableListLineMixin
        ],
        subclass:ListController
    };
    var widget = WidgetFactory('euewi', {


    },listOptions);

    return widget;
});
