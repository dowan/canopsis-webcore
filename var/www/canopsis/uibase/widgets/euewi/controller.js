define([
    'jquery',
    'app/lib/factories/widget',
    'canopsis/uibase/mixins/listlinedetail',
    'canopsis/uibase/widgets/list/controller'
], function($, WidgetFactory , DetailMixin , ListController) {

    var get = Ember.get;

    var listOptions = {
        mixins: [
            DetailMixin
        ],
        subclass: ListController
    };

    var widget = WidgetFactory('euewi', {
    },listOptions);

    return widget;
});
