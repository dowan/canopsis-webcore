  define([
  'jquery',
  'ember',
  'app/application'
], function($, Ember, Application) {

      Application.ProgressBars = Ember.View.extend({
      classNames: 'progress',

      template: function(context , data) {
        arguments = arguments;
        var statusClass = data.data.view.get('statusClass'),
            percent     = data.data.view.get('percent'),
            widthStyle  = "style='width: %@%;'".fmt(percent);
            template = "<div class='progress'><div class='progress-bar" +(statusClass ? " " + statusClass : '') + "' " + widthStyle + "></div></div>";
        return template;
      },

      percent: 0,
      status: undefined,

      percentDidChange: Ember.observer(function() {
        var percent = this.get('percent') || 0;
        this.$('.bar').css('width', percent + "%");
      }, 'percent'),

      statusClass: Ember.computed(function() {
        var status = this.get('status');
        return status == null ? '' : 'bar-' + status;
      }).property('status').cacheable(),

      statusClassWillChange: Ember.beforeObserver(function() {
        this.$('.bar').removeClass(this.get('statusClass'));
      }, 'statusClass'),

      statusClassDidChange: Ember.observer(function() {
        this.$('.bar').addClass(this.get('statusClass'));
      }, 'statusClass')
  })
})