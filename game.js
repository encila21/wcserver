$(function(){

	var answers = [{
			"text":		"Apple",
			"order":	"1"
		}, {
			"text":		"Grapes",
			"order":	"2"
		}, {
			"text":		"Mango",
			"order":	"3"
		}, {
			"text":		"Broccoli",
			"order":	"4"
		}, {
			"text":		"Asparagus",
			"order":	"5"
		}, {
			"text":		"Corn",
			"order":	"6"
		}, {
			"text":		"Windows",
			"order":	"7"
		}, {
			"text":		"Linux",
			"order":	"8"
		}, {
			"text":		"Android",
			"order":	"9"
	}];


	var subcontainers = [{
			"text":		"Fruits",
			"id":		"fruits"
		}, {
			"text":		"Vegetables",
			"id":		"vegetables"
		}, {
			"text":		"Operating Systems",
			"id":		"neverpresent"
	}];


	var fruits_correct = new Array('answer1','answer2','answer3');
	var veggies_correct = new Array('answer4','answer5','answer6');
	var os_correct = new Array('answer7','answer8','answer9');


	reset_game();																
	
	$('#game_container #button_container #reset_button').click(function(){
		reset_game();
	});
	
	$('#game_container #button_container #check_button').click(function(){
		$("#game_container .qanswer").promise().done(function() { 				
			score_game();														
		});
	});
	
	$('#game_container #ok_button').click(function(){
		$('#game_container #message').animate( {
			width: '0',
			height: '0',
			padding: '0',
			opacity: 0
		}, 1000).hide(1000);
	});

	function reset_game() {
		$('#game_container #draggable_container').html('').removeClass();
		$('#game_container #droppable_container').html('');
		$('#game_container #check_button').removeAttr('disabled');
		$('#game_container #message').hide();
		$('#game_container #score_container').hide();

		for (var j=0; j<3; j++) {
			$('<div><strong>' + subcontainers[j].text + '</strong></div>').attr('class', 'subcontainer').attr('id', subcontainers[j].id).appendTo('#game_container #droppable_container').sortable({
				containment: "#game_container",
				cursor: "move",
				items: "div",
				revert: 250,
				connectWith: "#game_container .subcontainer",
				receive: function(event, ui) {
					if (ui.item.parents('#game_container .subcontainer')) {
						ui.item.removeClass('dragthis').addClass('dropped');
					} else {
						ui.item.removeClass('dropped').addClass('dragthis');
					}
				}
			}).disableSelection();
		}
		answers.sort(function(){ return (Math.round(Math.random())-0.5); });
		for (var i=0; i<answers.length; i++) {
			$('<div>' + answers[i].text + '</div>').attr('id', 'answer' + answers[i].order).attr('class', 'dragthis qanswer').appendTo('#game_container #draggable_container').disableSelection();
		}
		$("#game_container #draggable_container").sortable({
			connectWith: '#game_container .subcontainer',
			containment: '#game_container',
			cursor: 'move',
			items: 'div',
			revert: 250
		}).disableSelection();
	}
	
	function score_game() {
		if (!$("#game_container #draggable_container").is(":empty")) {
			$('#game_container #message #text').html('The game is not complete! Please drag all answers to a category first.');
			$('#game_container #message').show().css({
				top: $("#game_container #droppable_container").position().top-50,
				left: $("#game_container #droppable_container").position().left+100
			}).animate( {
				width: '450px',
				height: '80px',
				padding: '20px',
				opacity: 1
			}, 500);
			
			return;
		}

		$("#game_container .subcontainer").each(function(index){
			$(this).sortable("option","disabled",true);
		});
		
		// also disable the "check" button
		$('#game_container #button_container #check_button').attr("disabled", "disabled");
		


		// go through each and see if it's in the right place
		$correctcounter = 0;																				
		$("#game_container .dropped").each(function(index){
			$thisid = $(this).attr('id');																	
			$parentid = $(this).parent().attr('id');
			$(this).css('cursor','default');																
			if (																							
				($.inArray($thisid, fruits_correct) > -1 && $parentid == 'fruits') ||
				($.inArray($thisid, veggies_correct) > -1 && $parentid == 'vegetables') ||
				($.inArray($thisid, os_correct) > -1 && $parentid == 'neverpresent')
			) {
				$(this).addClass('correct', 800).removeClass('dropped', 800);								
				$correctcounter++;																			
			} else {
				$(this).addClass('incorrect', 800).removeClass('dropped', 800);								
			}
		});
		
		$('#game_container #score_container #score_text').html('You got <span class="score">' + $correctcounter + '</span> out of 9 correct!');
		$('#game_container #score_container').slideDown(500);
	}
})