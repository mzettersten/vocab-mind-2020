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
  jsPsych['survey-text-likert-new'] = (function() {

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
	  
	  display_element.html("");
	  display_element.animate({'height': trial.height},0);
	  
	  //hold question data
      var question_data = {};

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
      
	  
	    // display_element.append('<form id="jspsych-survey-likert-form">');
	    // // add likert scale questions
	    // for (var i = 0; i < trial.questions.length; i++) {
	    //   form_element = $('#jspsych-survey-likert-form');
	    //   // add question
	    //   form_element.append('<label class="jspsych-survey-likert-statement">' + trial.questionsLikert[i] + '</label>');
	    //   // add options
	    //   var width = 100 / trial.labels[i].length;
	    //   options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
	    //   for (var j = 0; j < trial.labels[i].length; j++) {
	    //     options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][j] + '</label></li>';
	    //   }
	    //   options_string += '</ul>';
	    //   form_element.append(options_string);
	    // };
	};

	    // add submit button
	    display_element.append($('<button>', {
	      'id': 'jspsych-survey-likert-next',
	      'class': 'jspsych-survey-likert jspsych-btn'
	    }));
	    $("#jspsych-survey-likert-next").html('Submit');
	    $("#jspsych-survey-likert-next").click(function() {
	      // measure response time
	      var endTime = (new Date()).getTime();
	      var response_time = endTime - startTime;
		  var startTime_Likert = (new Date()).getTime();
		  //hide button
		  $("#jspsych-survey-likert-next").hide();
		  //make text area read only
		  $("div.jspsych-survey-text-likert-question").each(function(){
		    $(this).children('textarea').attr('readonly','readonly');
		  });
          // create object to hold text responses
          $("div.jspsych-survey-text-likert-question").each(function(index) {
            var id = "Q" + index;
            var val = $(this).children('textarea').val();
            var obje = {};
            obje[id] = val;
            $.extend(question_data, obje);
          });
		  //add likert question after response
  	    display_element.append('<form id="jspsych-survey-likert-form">');
  	    // add likert scale questions
  	    for (var i = 0; i < trial.questions.length; i++) {
  	      form_element = $('#jspsych-survey-likert-form');
  	      // add question
  	      form_element.append('<label class="jspsych-survey-likert-statement">' + trial.questionsLikert[i] + '</label>');
  	      // add options
  	      var width = 100 / trial.labels[i].length;
  	      options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
  	      for (var j = 0; j < trial.labels[i].length; j++) {
  	        options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][j] + '</label></li>';
  	      }
  	      options_string += '</ul>';
  	      form_element.append(options_string);
  	    };
		
    // add submit button
    display_element.append($('<button>', {
      'id': 'jspsych-survey-likert-next-2',
      'class': 'jspsych-survey-likert jspsych-btn'
    }));
    $("#jspsych-survey-likert-next-2").html('Submit Answers');
    $("#jspsych-survey-likert-next-2").click(function() {
      // measure response time
      var endTime_Likert = (new Date()).getTime();
      var response_time_likert = endTime_Likert - startTime_Likert;
	      // create object to hold responses
	      var likert_data = {};
	      $("#jspsych-survey-likert-form .jspsych-survey-likert-opts").each(function(index) {
	        var id = $(this).data('radio-group');
	        var response = $('input[name="' + id + '"]:checked').val();
	        if (typeof response == 'undefined') {
	          response = -1;
	        }
	        var obje = {};
	        obje[id] = response;
	        $.extend(likert_data, obje);
	      });

        // save data
        jsPsych.data.write({
          "rtName": response_time,
			"rtLikert": response_time_likert,
          "textResponses": JSON.stringify(question_data),
		  "likertResponses": JSON.stringify(likert_data),
        });

        display_element.html('');

        // next trial
        jsPsych.finishTrial();
	});
      });

      var startTime = (new Date()).getTime();
    };

    return plugin;
  })();
})(jQuery);
