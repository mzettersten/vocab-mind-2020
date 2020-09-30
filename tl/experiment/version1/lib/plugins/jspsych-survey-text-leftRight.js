/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

(function($) {
 jsPsych['survey-text-leftRight'] = (function() {
                           
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
                           
                                     //alert(params.displayPBP[0][0].split("_").slice(0)[0]);
                           trials.push({
                                       displayImage: params.displayImage,
                                       test: params.test,
                                       height: params.size,
                                       pbp: params.displayPBP[0][0].split("_").slice(0)[0],
                                       preamble: typeof params.preamble == 'undefined' ? "" : params.preamble[i],
                                       questions: params.questions[i],
                                       rows: typeof params.rows == 'undefined' ? rows : params.rows[i],
                                       columns: typeof params.columns == 'undefined' ? cols : params.columns[i]
                                       });
                           }
                           return trials;
                           };
                           
                           plugin.trial = function(display_element, trial) {
                           
                           display_element.html("");
                           
                           display_element.animate({'height': trial.height},0);
                           
                           
                           // if any trial variables are functions
                           // this evaluates the function and replaces
                           // it with the output of the function
                           trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
                           
                           if(trial.displayImage == "true"){
                           display_element.append($('<img>', {"src": "lib/images/SurveyImages/" + trial.pbp + "_Survey.jpg",
                                                    "id": "Bongard3",
                                                    }).width(500).height(320));}
                           
                           // show preamble text
                           display_element.append($('<div>', {
                                                    "id": 'jspsych-survey-likert-preamble',
                                                    "class": 'jspsych-survey-likert-preamble'
                                                    }));
                           
                           $('#jspsych-survey-likert-preamble').html(trial.preamble);
                           
                           
                           if(trial.test == "true")
                           {
                           // add questions
                           for (var i = 0; i < trial.questions.length; i++) {
                           // create div
                           display_element.append($('<div>', {
                                                    "id": 'Tjspsych-survey-text-' + i,
                                                    "class": 'Tjspsych-survey-text-question'
                                                    }));

                           // add question text
                           $("#Tjspsych-survey-text-" + i).append('<p class="Tjspsych-survey-text">' + trial.questions[i] + '</p>');
                           
                           // add text box
                           $("#Tjspsych-survey-text-" + i).append('<textarea name="#Tjspsych-survey-text-response-' + i + '" cols="'+trial.columns[i]+'" rows="'+trial.rows[i]+'"></textarea>');}}
                           
                           else
                           {
                           // add questions
                           for (var i = 0; i < trial.questions.length; i++) {
                           // create div
                           display_element.append($('<div>', {
                                                    "id": 'APjspsych-survey-text-' + i,
                                                    "class": 'APjspsych-survey-text-question'
                                                    }));

                           // add question text
                           $("#APjspsych-survey-text-" + i).append('<p class="APjspsych-survey-text">' + trial.questions[i] + '</p>');
                           
                           // add text box
                           $("#APjspsych-survey-text-" + i).append('<textarea name="#APjspsych-survey-text-response-' + i + '" cols="'+trial.columns[i]+'" rows="'+trial.rows[i]+'"></textarea>');}}
                           
                           // add submit button
                           if(trial.test == "true"){
                           display_element.append($('<button>', {
                                                    'id': 'Tjspsych-survey-text-next',
                                                    'class': 'Tjspsych-survey-text'
                                                    }));
                           $("#Tjspsych-survey-text-next").html('Submit Answers');
                           $("#Tjspsych-survey-text-next").click(function() {
                                                                // measure response time
                                                                var endTime = (new Date()).getTime();
                                                                var response_time = endTime - startTime;
                                                                
                                                                // create object to hold responses
                                                                var question_data = {};
                                                                $("div.Tjspsych-survey-text-question").each(function(index) {
                                                                                                           var id = "Q" + index;
                                                                                                           var val = $(this).children('textarea').val();
                                                                                                           var obje = {};
                                                                                                           obje[id] = val;
                                                                                                           $.extend(question_data, obje);
                                                                                                           });
                                                                
                                                                // save data
                                                                jsPsych.data.write({
                                                                                   "rt": response_time,
                                                                                   "responses": JSON.stringify(question_data),
																	"leftResponse": question_data["Q0"],
																	"rightResponse": question_data["Q1"]
                                                                                   });
                                                                
                                                                display_element.animate({'height': '95px'}, 100);
                                                                display_element.html('');
                                                                
                                                                // next trial
                                                                jsPsych.finishTrial();
                                                                });
                           }
                           else{
                           // add submit button
                           display_element.append($('<button>', {
                                                    'id': 'APjspsych-survey-text-next',
                                                    'class': 'APjspsych-survey-text'
                                                    }));
                           $("#APjspsych-survey-text-next").html('Submit Answers');
                           $("#APjspsych-survey-text-next").click(function() {
                                                                // measure response time
                                                                var endTime = (new Date()).getTime();
                                                                var response_time = endTime - startTime;
                                                                
                                                                // create object to hold responses
                                                                var question_data = {};
                                                                $("div.APjspsych-survey-text-question").each(function(index) {
                                                                                                           var id = "Q" + index;
                                                                                                           var val = $(this).children('textarea').val();
                                                                                                           var obje = {};
                                                                                                           obje[id] = val;
                                                                                                           $.extend(question_data, obje);
                                                                                                           });
                                                                
                                                                // save data
                                                                jsPsych.data.write({
                                                                                   "rt": response_time,
                                                                                   "responses": JSON.stringify(question_data),
																	"gender": question_data["Q0"],
																	"age": question_data["Q1"],
																	"L1": question_data["Q2"],
																	"otherL": question_data["Q3"]
                                                                                   });
                                                                
                                                                display_element.animate({'height': '95px'}, 100);
                                                                display_element.html('');
                                                                
                                                                // next trial
                                                                jsPsych.finishTrial();
                                                                });
                           }
                           
                           
                           var startTime = (new Date()).getTime();
                           };
                           
                           return plugin;
                           })();
 })(jQuery);
