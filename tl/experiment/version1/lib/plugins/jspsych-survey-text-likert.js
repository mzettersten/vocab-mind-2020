/**
 * jspsych-survey-text-likert
 * a jspsych plugin for free response survey questions followed by a likert scale question
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

(function($) {
  jsPsych['survey-text-likert'] = (function() {

    var plugin = {};

    plugin.create = function(params) {

      //params = jsPsych.pluginAPI.enforceArray(params, ['data']);

      var trials = [];
      for (var i = 0; i < params.questions.length; i++) {
        var rows = [], cols = [];
        if(typeof params.rows == 'undefined' || typeof params.columns == 'undefined'){
          for(var j = 0; j < params.questions[i].length; j++){
            cols.push(40);
            rows.push(1);
          }
        }

        trials.push({
		  height: params.size,
          preamble: typeof params.preamble == 'undefined' ? "" : params.preamble[i],
          questions: params.questions[i],
          rows: typeof params.rows == 'undefined' ? rows : params.rows[i],
          columns: typeof params.columns == 'undefined' ? cols : params.columns[i],
		  questionsLikert: params.questionsLikert[i],
          labels: params.labels[i],
          intervals: params.intervals[i],
          show_ticks: (typeof params.show_ticks === 'undefined') ? true : params.show_ticks
        });
      }
      return trials;
    };

    plugin.trial = function(display_element, trial) {

      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
	  display_element.html("");
	  display_element.animate({'height': trial.height},0);

      // show preamble text
      display_element.append($('<div>', {
        "id": 'jspsych-survey-likert-preamble',
        "class": 'jspsych-survey-likert-preamble'
      }));

      $('#jspsych-survey-likert-preamble').html(trial.preamble);
      // add questions
      for (var i = 0; i < trial.questions.length; i++) {
        // create div
        display_element.append($('<div>', {
          "id": 'jspsych-survey-text-' + i,
          "class": 'jspsych-survey-text-likert-question'
        }));

        // add question text
        $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i] + '</p>');

        // add text box
        $("#jspsych-survey-text-" + i).append('<textarea name="#jspsych-survey-text-response-' + i + '" cols="'+trial.columns[i]+'" rows="'+trial.rows[i]+'"></textarea>');
      
	  
      // create div for likert scale
      display_element.append($('<div>', {
        "id": 'jspsych-survey-text-likert-' + i,
        "class": 'jspsych-survey-text-likert-question'
      }));

      // add question text
      $("#jspsych-survey-text-likert-" + i).append('<p class="jspsych-survey-text likert survey-text-likert">' + trial.questionsLikert[i] + '</p>');

      // create slider
      $("#jspsych-survey-text-likert-" + i).append($('<div>', {
        "id": 'jspsych-survey-text-likert-slider-' + i,
        "class": 'jspsych-survey-text-likert-slider jspsych-survey-text-likert'
      }));
      $("#jspsych-survey-text-likert-slider-" + i).slider({
        value: Math.ceil(trial.intervals[i] / 2),
        min: 1,
        max: trial.intervals[i],
        step: 1
      });

      // show tick marks
      if (trial.show_ticks) {
        $("#jspsych-survey-text-likert-" + i).append($('<div>', {
          "id": 'jspsych-survey-text-likert-sliderticks' + i,
          "class": 'jspsych-survey-text-likert-sliderticks jspsych-survey-text-likert',
          "css": {
            "position": 'relative'
          }
        }));
        for (var j = 1; j < trial.intervals[i] - 1; j++) {
          $('#jspsych-survey-text-likert-slider-' + i).append('<div class="jspsych-survey-text-likert-slidertickmark"></div>');
        }

        $('#jspsych-survey-text-likert-slider-' + i + ' .jspsych-survey-text-likert-slidertickmark').each(function(index) {
          var left = (index + 1) * (100 / (trial.intervals[i] - 1));
          $(this).css({
            'position': 'absolute',
            'left': left + '%',
            'width': '1px',
            'height': '100%',
            'background-color': '#222222'
          });
        });
      }

      // create labels for slider
      $("#jspsych-survey-text-likert-" + i).append($('<ul>', {
        "id": "jspsych-survey-text-likert-sliderlabels-" + i,
        "class": 'jspsych-survey-text-likert-sliderlabels survey-text-likert',
        "css": {
          "width": "100%",
          "margin": "0px 0px 0px 0px",
          "padding": "0px",
          "display": "inline-block",
          "position": "relative",
          "height": "2em",
			"text-align": "center"
        }
      }));
	  
      for (var j = 0; j < trial.labels[i].length; j++) {
        $("#jspsych-survey-text-likert-sliderlabels-" + i).append('<li>' + trial.labels[i][j] + '</li>');
      }

      // position labels to match slider intervals
      var slider_width = $("#jspsych-survey-text-likert-slider-" + i).width();
      var num_items = trial.labels[i].length;
      var item_width = slider_width / num_items;
      var spacing_interval = slider_width / (num_items - 1);

      $("#jspsych-survey-text-likert-sliderlabels-" + i + " li").each(function(index) {
        $(this).css({
          'display': 'inline-block',
          'width': item_width + 'px',
          'margin': '0px',
          'padding': '11px',
          //'text-align': 'center',
          //'position': 'absolute',
          'left': (spacing_interval * index) - (item_width / 2)
        });
      });
    };

      // add submit button
      display_element.append($('<button>', {
        'id': 'jspsych-survey-text-next',
        'class': 'jspsych-survey-text-likert'
      }));
      $("#jspsych-survey-text-next").html('Submit Answers');
      $("#jspsych-survey-text-next").click(function() {
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        // create object to hold text responses
        var question_data = {};
        $("div.jspsych-survey-text-likert-question").each(function(index) {
          var id = "Q" + index;
          var val = $(this).children('textarea').val();
          var obje = {};
          obje[id] = val;
          $.extend(question_data, obje);
        });
		
        // create object to hold likert responses
        var likert_data = {};
        $("div.jspsych-survey-text-likert-slider").each(function(index) {
          var id = "Q" + index;
          var val = $(this).slider("value");
          var obje = {};
          obje[id] = val;
          $.extend(likert_data, obje);
        });

        // save data
        jsPsych.data.write({
          "rt": response_time,
          "textResponses": JSON.stringify(question_data),
		  "likertResponses": JSON.stringify(likert_data),
        });

        display_element.html('');

        // next trial
        jsPsych.finishTrial();
      });

      var startTime = (new Date()).getTime();
    };

    return plugin;
  })();
})(jQuery);
