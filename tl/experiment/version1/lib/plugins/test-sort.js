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
 jsPsych['test-sort'] = (function() {
                         
                         var plugin = {};
                         
                         plugin.create = function(params) {
                         
                         //params = jsPsych.pluginAPI.enforceArray(params, ['data']);
                         
                         var trials = new Array(params.stimuli.length);
                         for (var i = 0; i < trials.length; i++) {
                         trials[i] = {
                         "images": params.stimuli[i], // array of images to display
                         "imageNames": params.stimNames[i],
                         "sortTypes":params.sortTypes[i],
                         "categories": params.category[i],
						"categoryLoc": params.categoryLoc[i],
                         //"sorted_images": params.sorted_images[i],
                         //"sorted_categories": params.sorted_categories[i],
						"feedback": (typeof params.feedback === 'undefined') ? true : params.feedback,
						"repeatIncorrect": (typeof params.repeatIncorrect === 'undefined') ? true : params.repeatIncorrect,
							 "stack": (typeof params.stack === 'undefined') ? false : params.stack,
                         "timing_post_trial": (typeof params.timing_post_trial === 'undefined') ? 1000 : params.timing_post_trial,
                         "prompt": (typeof params.prompt === 'undefined') ? '' : params.prompt,
                         "prompt_location": params.prompt_location || "above",
                         };
                         }
                         return trials;
                         }
                         
                         plugin.trial = function(display_element, trial) {
                         
                         // if any trial variables are functions
                         // this evaluates the function and replaces
                         // it with the output of the function
                         //trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);
                         trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
                         display_element.html("");
                         var start_time = (new Date()).getTime();
                         
                         // check if there is a prompt and if it is shown above
                         if (trial.prompt && trial.prompt_location == "above") {
                         display_element.append(trial.prompt);
                         }
                         
                         display_element.append($('<div>', {
                                                  "id": "newTrial",
                                                  "class": "newTrial",
                                                  "text": "Initializing Next Phase"
                                                  }));
                         
                         display_element.append($('<div>', {
                                                  "id": "jspsych-free-sort-arena",
                                                  "class": "jspsych-free-sort-arena"
                                                  }));
                         
                         display_element.append($('<div>', {
                                                  "id": "items",
                                                  "class": "items"
                                                  }));
                         display_element.append($('<div>', {
                                                  "id": "Litems",
                                                  "class": "Litems"
                                                  }));
												  
                         display_element.append($('<div>', {
                                                  "id": "Ritems",
                                                  "class": "Ritems"
                                                  }));
					                              display_element.append($('<div>', {
					                                                       "id": "successMessage",
					                                                       "class": "successMessage",
					                                                       "text": "CORRECT"
					                                                       }));
                           
					                              display_element.append($('<div>', {
					                                                       "id": "failMessage",
					                                                       "class": "failMessage",
					                                                       "text": "INCORRECT"
					                                                       }));
                         display_element.append($('<div>', {
                                                  "id": "ButtonBlocker2",
                                                  "class": "ButtonBlocker2"
                                                  }));
                         
                         //Above sorting box labels
                         display_element.append($('<div>', {
                                                  'id': 'TleftType',
                                                  'class': 'TleftType'
                                                  }));
                         $("#TleftType").html('Category: ' + trial.sortTypes[0]);
                         
                         display_element.append($('<div>', {
                                                  'id': 'TrightType',
                                                  'class': 'TrightType'
                                                  }));
                         $("#TrightType").html('Category: ' + trial.sortTypes[1]);
                         
                         // check if prompt exists and if it is shown below
                         if (trial.prompt && trial.prompt_location == "below") {
                         display_element.append(trial.prompt);
                         }
                         
                         // store initial location data
                         var init_locations = [];
                         
                         //var offset={};
                         var leftCounter=0;
                         var rightCounter=0;
                         //Load side display images
                        /* for (var i = 0; i < trial.sorted_categories.length; i++)
                         {
                         
                         if (trial.sorted_categories[i]=="left") {
                         $("#Litems").append($('<img>', {
                                               "src": trial.sorted_images[i],
                                               "class": "left-bank"
                                               }));
                         
                         var offset = $($('.left-bank').get(leftCounter)).offset();
                         leftCounter++;
                         }
                         else
                         {
                         $("#Ritems").append($('<img>', {
                                               "src": trial.sorted_images[i],
                                               "class": "right-bank"
                                               }));
                         
                         var offset = $($('.right-bank').get(rightCounter)).offset();
                         rightCounter++;
                         
                         };
                         
                         init_locations.push({
                                             "src": trial.sorted_images[i],
                                             "x": offset.left,
                                             "y": offset.top
                                             });
                         };*/
                         
                         //Load testing images
                         for (var i = 0; i < trial.images.length; i++) {
                         $("#items").append($('<img>', {
                                              "src": trial.images[i],
                                              "class": "jspsych-free-sort-draggable"
                                              }));
                         
                         $($('.jspsych-free-sort-draggable').get(i)).data('categoryLoc', trial.categoryLoc[i]);
                         
                         
                         var offset = $($('.jspsych-free-sort-draggable').get(i)).offset();
                         init_locations.push({
                                             "src": trial.images[i],
                                             "x": offset.left,
                                             "y": offset.top,
                                             "category": trial.categories[i],
							 "categoryLoc": trial.categoryLoc[i],
                                             "imageNames": trial.imageNames[i]
                                             });
                         
                         };
                         
                         $('.jspsych-free-sort-draggable').hide();
                         $($('.jspsych-free-sort-draggable').get(0)).show();
                         //Timing delay for stimuli
                         var imgFade = 1000;
						 var imgFadeIncorrect = 4000;
						 var imgDelay = 300;
                         var imgShow = 500;
                         //Timing delay for feedback
						 var messageDelayCorrect = 1000;
						 var slotsDelayCorrect = 500;
						 var messageDelayIncorrect = 4000;
						 var slotsDelayIncorrect = 3500;
                         var preTerm = 2500;
                         var finalTerm = 1000;
                         $('#successMessage').hide();
                         $('#failMessage').hide();
                         $('#newTrial').hide();
						 
						 
                         
                         //LEFT CATEGORY drop for test image
                         $('<div>'+""+'</div>').data( 'catID', "left" ).appendTo( '#Litems' ).droppable( {
                                                                                                        hoverClass: 'hovered',
                                                                                                        drop: LeftDrop
                                                                                                        } );
                         
                         //RIGHT CATEGORY drop for test image
                         $('<div>'+""+'</div>').data( 'catID', "right" ).appendTo( '#Ritems' ).droppable( {
                                                                                                         hoverClass: 'hovered',
                                                                                                         drop: RightDrop
                                                                                                         } );
                         
                         var moves = [];
                         var dropCorrect = 0;
                         var dropPosition = "";
						 var trialNum=1;
						 var firstTrial=1;
                         
                         $('.jspsych-free-sort-draggable').draggable({
                                                                     scroll: false,
                                                                     revert: true,
                                                                     stack: ".jspsych-free-sort-draggable"
                                                                     });
                         
                         display_element.append($('<button>', {
                                                  "id": "jspsych-free-sort-done-btn",
                                                  "class": "jspsych-free-sort",
                                                  "html": "Submit Selection",
                                                  "click": function() {
                                                  var end_time = (new Date()).getTime();
                                                  var rt = end_time - start_time;
                                                  // gather data
                                                  //Added:  looking up appropriate initial locations/final locations
                                                  var lookupInitLoc = {};
                                                  for (var i = 0, len = init_locations.length; i < len; i++) {
                                                  lookupInitLoc[init_locations[i].src] = init_locations[i];
                                                  };
                                                  var lookupFinalLoc = {};
                                                  for (var i = 0, len = final_locations.length; i < len; i++) {
                                                  lookupFinalLoc[final_locations[i].src] = final_locations[i];
                                                  };
                                                  
                                                  //added: for loop it up
                                                  for (var i=0; i<moves.length; i++) {
													  if (i===0) {
														  trialCounter=1;
														  firstTrial=1;
													  } else if ((moves[i-1]["correct"]==0) & (trial.repeatIncorrect)) {
													  //else if (lookupInitLoc[moves[i]["src"]]["imageNames"]===lookupInitLoc[moves[i-1]["src"]]["imageNames"]) {
														  firstTrial=0;
													  } else {
														  firstTrial=1;
														  trialCounter++;
													  }
													  trialNum=trialCounter;
                                                  jsPsych.data.write($.extend({}, {
													  "trialNum": trialNum,
													  "firstTrial": firstTrial,
                                                                              "moveNum": i+1,
                                                                              "src":moves[i]["src"],
                                                                              "category": lookupInitLoc[moves[i]["src"]]["category"],
													  "categoryLoc": lookupInitLoc[moves[i]["src"]]["categoryLoc"],
                                                                              "imageName": lookupInitLoc[moves[i]["src"]]["imageNames"],
                                                                              "init_locationsX": lookupInitLoc[moves[i]["src"]]["x"],
                                                                              "init_locationsY": lookupInitLoc[moves[i]["src"]]["y"],
                                                                              
                                                                              "movesX": moves[i]["x"],
                                                                              "movesY": moves[i]["y"],
                                                                              "dropTime": moves[i]["time"],
                                                                              "dropCorrect": moves[i]["correct"],
                                                                              "dropPosition": moves[i]["position"],
                                                                              "final_locationsX": lookupFinalLoc[moves[i]["src"]]["x"],
                                                                              "final_locationsY": lookupFinalLoc[moves[i]["src"]]["y"],
                                                                              "rt": rt
                                                                              }, trial.data));
                                                  };
                                                  
                                                  // advance to next part
                                                  display_element.html("");
                                                  display_element.append('<center style = "font-size:25px;line-height:85px">Please do not close the browser window</center>');
                                                  display_element.append($('<img>', {"src": "lib/images/ajax-loader-2.gif","id": "LoadSign",}).width(150).height(150));
                                                  
                                                  if (trial.timing_post_trial > 0) {
                                                  setTimeout(function() {
                                                             jsPsych.finishTrial();
                                                             }, trial.timing_post_trial);
                                                  }
                                                  else {jsPsych.finishTrial();}
                                                  }
                                                  }));
                         
                         
                         // helper functions
                         function term() {
                         Total = 0;
                         document.getElementById('jspsych-free-sort-done-btn').click();}
                         
                         //Variable for termination
                         var Total = 0;
                         
                         //Variable for final location
                         var final_locations = [];
                         
                         //LEFT DROP FUNCTIONS
                         function LeftDrop( event, ui) {
                         var catID = $(this).data( 'catID' );
                         var imgID = ui.draggable.data( 'categoryLoc' );
                         
                         dropCorrect = 0;
                         dropPosition = "left";
                         
                         if(catID === imgID){
							 dropCorrect = 1;
	                         ui.draggable.position( { of: $(this), my: 'center', at: 'center' } );
	                         ui.draggable.draggable( 'option', 'revert', false );
	                         ui.draggable.draggable( 'disable' );
						 }
                         else{
							 
							 if (!trial.repeatIncorrect) {
		                         ui.draggable.position( { of: $(this), my: 'center', at: 'center' } );
		                         ui.draggable.draggable( 'option', 'revert', false );
		                         ui.draggable.draggable( 'disable' );
								 
							 }
                         }
                         
                         
                         //$(this).droppable( 'disable' );
                         
                         //Record the movement of the scene
                         var offset = ui.draggable.offset();
                         //ADDED: Timing
                         var stop_time = (new Date()).getTime();
                         var time_since_trial_start = stop_time - start_time;
                         moves.push({
                                    "src": ui.draggable.attr('src'),
                                    "x": offset.left,
                                    "y": offset.top,
                                    //Added: time
                                    "time": time_since_trial_start,
                                    "correct": dropCorrect,
                                    "position": dropPosition,
                                    });
	  		             if (dropCorrect===1) {
							 if (trial.feedback) {
								 $('#successMessage').show(0);
								 $('#successMessage').delay(messageDelayCorrect).hide(0);
								 $('#Litems').animate({backgroundColor: '#58FA82'});
								 $('#Litems').delay(slotsDelayCorrect).animate({backgroundColor: '#9C9C9B'});
							 };
	                         //$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade).animate({top:'35px'});
							 //if stack=true, keep the image (so participants can see the last image they sorted), otherwise, hide it
							 if (!trial.stack) {
								 $($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade).hide(0);
							 } else {}
	                         Total++;
	                         // get final position of object
		                      
	                         final_locations.push({
	                                              "src": ui.draggable.attr('src'),
	                                              "x": offset.left,
	                                              "y": offset.top
	                                              });
						 } else {
							 if (trial.feedback) {
								 ui.draggable.position( { of: $(this), my: 'center', at: 'center' } );
								 ui.draggable.draggable( 'disable' );
								 ui.draggable.delay(messageDelayIncorrect).draggable( 'enable' );
								 $('#failMessage').show(0);
								 $('#failMessage').delay(messageDelayIncorrect).hide(0);
								 $('#Litems').animate({backgroundColor: '#F78181'});
								 $('#Litems').delay(slotsDelayIncorrect).animate({backgroundColor: '#9C9C9B'});
							 };
							 
							 if (!trial.repeatIncorrect) {
	   							 if ((!trial.stack) && (trial.feedback)) {
	   								 $($('.jspsych-free-sort-draggable').get(Total)).delay(imgFadeIncorrect).hide(0);
	   							 } else if ((!trial.stack) && (!trial.feedback)) {
	   							 	$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade).hide(0);
								} else {}
									Total++;
		                            // get final position of object
		                            final_locations.push({
		                                                 "src": ui.draggable.attr('src'),
		                                                 "x": offset.left,
		                                                 "y": offset.top
		                                                 });
							 };
						 }
                         
                         
                         
                         
                         if(Total===trial.images.length){
                         setTimeout(term, preTerm);
                         setTimeout("$('#newTrial').show(0);$('#newTrial').delay(1300).hide(0);",finalTerm);}
                         else{
							 if (dropCorrect) {
                         $($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade+imgDelay).show(imgShow);}
						 else{
							 if ((!trial.repeatIncorrect)&& (trial.feedback)) {
							 	$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFadeIncorrect+imgDelay).show(imgShow);
							 } else if ((!trial.repeatIncorrect)&& (!trial.feedback)) {
							 	$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade+imgDelay).show(imgShow);
							 } ;
						 };
					 }
					 }
                         
                         //RIGHT DROP FUNCTION
                         function RightDrop( event, ui) {
                         var catID = $(this).data( 'catID' );
                         var imgID = ui.draggable.data( 'categoryLoc' );
                         
                         dropCorrect = 0;
                         dropPosition = "right";
                         
                         if(catID === imgID){
							 dropCorrect = 1;
                         
	                         ui.draggable.draggable( 'disable' );
	                         //$(this).droppable( 'disable' );
	                         ui.draggable.position( { of: $(this), my: 'center', at: 'center' } );
	                         ui.draggable.draggable( 'option', 'revert', false );
						 }
                         else{
							 if (!trial.repeatIncorrect) {
		                         ui.draggable.position( { of: $(this), my: 'center', at: 'center' } );
		                         ui.draggable.draggable( 'option', 'revert', false );
		                         ui.draggable.draggable( 'disable' );
							 }
                         }
                         
                         
                         //Record the movement of the scene
                         var offset = ui.draggable.offset();
                         //ADDED: Timing
                         var stop_time = (new Date()).getTime();
                         var time_since_trial_start = stop_time - start_time;
                         moves.push({
                                    "src": ui.draggable.attr('src'),
                                    "x": offset.left,
                                    "y": offset.top,
                                    //Added: time
                                    "time": time_since_trial_start,
                                    "correct": dropCorrect,
                                    "position": dropPosition
                                    });
						if (dropCorrect===1) {
						 if (trial.feedback) {
							 $('#successMessage').show(0);
							 $('#successMessage').delay(messageDelayCorrect).hide(0);
							 $('#Ritems').animate({backgroundColor: '#58FA82'});
							 $('#Ritems').delay(slotsDelayCorrect).animate({backgroundColor: '#9C9C9B'});
						 };
			                            
                         
			                            //$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade).animate({top:'35px'});
		   							 //if stack=true, keep the image (so participants can see the last image they sorted), otherwise, hide it
		   							 if (!trial.stack) {
		   								 $($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade).hide(0);
		   							 } else {}
										Total++;
			                            // get final position of object
			                            final_locations.push({
			                                                 "src": ui.draggable.attr('src'),
			                                                 "x": offset.left,
			                                                 "y": offset.top
			                                                 });
		   						 } else {
									 if (trial.feedback) {
										 ui.draggable.position( { of: $(this), my: 'center', at: 'center' } );
										 ui.draggable.draggable( 'disable' );
										 ui.draggable.delay(messageDelayIncorrect).draggable( 'enable' );
										 $('#failMessage').show(0);
										 $('#failMessage').delay(messageDelayIncorrect).hide(0);
										 $('#Ritems').animate({backgroundColor: '#F78181'});
										 $('#Ritems').delay(slotsDelayIncorrect).animate({backgroundColor: '#9C9C9B'});
									 };
									 
									 if (!trial.repeatIncorrect) {
			   							 if ((!trial.stack) && (trial.feedback)) {
			   								 $($('.jspsych-free-sort-draggable').get(Total)).delay(imgFadeIncorrect).hide(0);
											 
											 
			   							 } else if ((!trial.stack) && (!trial.feedback)) {
			   							 	$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade).hide(0);
										} else {}
											Total++;
				                            // get final position of object
				                            final_locations.push({
				                                                 "src": ui.draggable.attr('src'),
				                                                 "x": offset.left,
				                                                 "y": offset.top
				                                                 });
									 };
		   						 }
                         
                         
                         if(Total===trial.images.length){
                         setTimeout(term, preTerm);
                         setTimeout("$('#newTrial').show(0);$('#newTrial').delay(1300).hide(0);",finalTerm);}
                         else{
							 if (dropCorrect) {
                         $($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade+imgDelay).show(imgShow);}
						 else{
							 if ((!trial.repeatIncorrect)&& (trial.feedback)) {
							 	$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFadeIncorrect+imgDelay).show(imgShow);
							 } else if ((!trial.repeatIncorrect)&& (!trial.feedback)) {
							 	$($('.jspsych-free-sort-draggable').get(Total)).delay(imgFade+imgDelay).show(imgShow);
							 } ;
						 };
					 }
					 }
                         
                         
                         }
                         return plugin;
                         })();
 })(jQuery);
