/**
 * jspsych-survey-likert
 * a jspsych plugin for measuring items on a likert scale
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

(function($) {
  jsPsych['survey-likert-new'] = (function() {

    var plugin = {};

    plugin.create = function(params) {

      //params = jsPsych.pluginAPI.enforceArray(params, ['data']);

      var trials = [];
      for (var i = 0; i < params.questions.length; i++) {
        trials.push({
			height: params.size,
          preamble: (typeof params.preamble === 'undefined') ? "" : params.preamble[i],
          questions: params.questions[i],
          labels: params.labels[i],
          //intervals: params.intervals[i],
          //show_ticks: (typeof params.show_ticks === 'undefined') ? true : params.show_ticks
        });
      }
      return trials;
    };

    plugin.trial = function(display_element, trial) {

      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
	  //modified by MZ to adjust height of box
	  display_element.html("");
	  display_element.animate({'height': trial.height},0);

      // show preamble text
      display_element.append($('<div>', {
        "id": 'jspsych-survey-likert-preamble',
        "class": 'jspsych-survey-likert-preamble'
      }));

      $('#jspsych-survey-likert-preamble').html(trial.preamble);

      // add likert scale questions
      display_element.append('<form id="jspsych-survey-likert-form">');
      // add likert scale questions
      for (var i = 0; i < trial.questions.length; i++) {
        form_element = $('#jspsych-survey-likert-form');
        // add question
        form_element.append('<label class="jspsych-survey-likert-statement">' + trial.questions[i] + '</label>');
        // add options
        var width = 100 / trial.labels[i].length;
        options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
        for (var j = 0; j < trial.labels[i].length; j++) {
          options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][j] + '</label></li>';
        }
        options_string += '</ul>';
        form_element.append(options_string);
      }

      // add submit button
      display_element.append($('<button>', {
        'id': 'jspsych-survey-likert-next',
        'class': 'jspsych-survey-likert jspsych-btn'
      }));
      $("#jspsych-survey-likert-next").html('Submit Answers');
      $("#jspsych-survey-likert-next").click(function() {
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        // create object to hold responses
        var question_data = {};
        $("#jspsych-survey-likert-form .jspsych-survey-likert-opts").each(function(index) {
          var id = $(this).data('radio-group');
          var response = $('input[name="' + id + '"]:checked').val();
          if (typeof response == 'undefined') {
            response = -1;
          }
          var obje = {};
          obje[id] = response;
          $.extend(question_data, obje);
        });

        // save data
		jsPsych.data.write({
			"rt": response_time,
			"responses": JSON.stringify(question_data)
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
