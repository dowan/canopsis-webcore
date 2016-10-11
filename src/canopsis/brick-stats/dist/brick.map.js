{"version":3,"sources":["src/widgets/stats-table/controller.js"],"names":["Ember","Application","initializer","name","after","initialize","container","application","WidgetFactory","lookupFactory","MetricConsumer","MetricFilterable","TimeWindowUtils","get","set","isNone","widgetOptions","mixins","widget","init","this","_super","apply","arguments","updateInterval","interval","from","to","undefined","refreshContent","findItems","tw","getFromTo","liveFrom","liveTo","store","me","findQuery","filter","getMetricFilter","then","result","metric_ids","forEach","ctx","push","length","aggregateMetrics","onMetrics","metrics","users","events","series","$","each","idx","metric","mid","split","points","npoints","value","__","component","resource","metricname","varname","context","__name__","label","join","data","notifyPropertyChange","getDelaySeries","resources","isUser","delayMetrics","selected","sources","groups","condition","cmp","serie","indexOf","groupname","point","columns","key","concat","x","type","axis","userAlarmSolvedSeries","property","userAlarmAckSeries","userAlarmAckSolvedSeries","userSessionSeries","alarmSolvedSeries","alarmAckSeries","alarmAckSolvedSeries","alarmCounters","alarmMetrics","alarmLabels","userTable","items","item","hasOwnProperty","excludeKeys","counters","ack","countername","counter","user","userCounters","eventCounterTotal","eventCounterAck","eventCounterSolved","eventCounterAckSolved","register"],"mappings":"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","file":"dist/brick.map.js"}