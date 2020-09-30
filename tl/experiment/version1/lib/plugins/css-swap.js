/**
 * active sorting categorization experiment
 * based on
 * jspsych-free-sort
 * plugin for drag-and-drop sorting of a collection of images
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 */

(function($) {
 jsPsych['css-swap'] = (function() {
                        
                        var plugin = {};
                        
                        plugin.create = function(params) {
                        
                        var trials = [];
                        trials.push({phase: params.phase});
                        return trials;
                        }
                        
                        plugin.trial = function(display_element, trial) {
 
                        display_element.append($('<button>', {
                                                 "id": "jspsych-free-sort-done-btn",
                                                 "class": "jspsych-free-sort",
                                                 "html": "Submit Selection",
                                                 "click": function() {
                                                 display_element.html("");
                                                 
                                                
                                                 
                                                 if (trial.phase=="learnToTest") {
                                                 $('link[rel=stylesheet][href="lib/css/Active-Passive.css"]').remove();
                                                 $('head').append('<link rel="stylesheet" type="text/css" href="lib/css/Testing.css"></link>');
                                                 } else {
                                                 $('link[rel=stylesheet][href="lib/css/Testing.css"]').remove();
                                                 $('head').append('<link rel="stylesheet" type="text/css" href="lib/css/Active-Passive.css"></link>');
                                                 }
                                                 
                                                 //if (trial.timing_post_trial > 0) {
                                                 //setTimeout(function() {
                                                 //           jsPsych.finishTrial();
                                                 //           }, trial.timing_post_trial);
                                                 //}
                                                 //else {
                                                 jsPsych.finishTrial();
                                                 //}
                                                 }
                                                 }));
                        
                        //setTimeout(term,3000);
                        term();
                        }
                        
                        // helper functions
                        function term() {
                        leftTotal = 0;
                        rightTotal = 0;
                        document.getElementById('jspsych-free-sort-done-btn').click();
                        }
                        
                        
                        
                        return plugin;
                        })();
 })(jQuery);



