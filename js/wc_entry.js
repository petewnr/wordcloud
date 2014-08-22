jQuery(document).ready(function($) {
    
    		Parse.initialize("0fDoU3tixdDTgs3iGWxjWdsbN8EsyjE6wFwtMy7j","CQTCCMfGXwyPbukMSAoawLCxemrcqor6urIypgCs");
    		
var questions_list = [];
var event_questions = [];
    		

$("#validate_event").click(function(e){
	e.preventDefault();
	
	$('.event_id').text("");
	$('.event_coord').text("");
	
	var entered_event_code = $("#event_code").val();
	
	var findevent = Parse.Object.extend("Event");
	var query = new Parse.Query(findevent);
	query.include("parent");
	query.equalTo("event_code", entered_event_code);
	
	query.find({
		success: function(foundevent) {
			
			if (foundevent.length !== 1) {
				console.log("Error: duplicate event codes");
			} else {
				var event_code = foundevent[0].get("event_code");
				var status = foundevent[0].get("Status");
				var event_id = foundevent[0].id;
				var event_user = foundevent[0].get("parent");
				var coord = event_user.get("username");
				console.log("ID is "+event_id+" "+coord);
				
				if (status == "closed") {
					console.log("This event is closed");
				} else {
					$('.event_id').append(event_code);
					$('.event_coord').append(coord);
					console.log("getting questions now for "+event_id);
	
					var Question = Parse.Object.extend("Question");
					var query = new Parse.Query(Question);
					query.equalTo("parent", foundevent[0]);
	
					query.find({
						success: function(results) {
							console.log("We found "+results.length+" questions for this");
							$('#question_selector').text("");
							for (var i=0;i<results.length;i++) {
								console.log(event_code+" q"+i+results[i].get("Question"));
								}
							
							for (var i=0;i<results.length;i++) {
								$('#question_selector').append("<option value='"+results[i].id+"'>"+results[i].get('Question')+"</option>");
								};
							},
						error: function(error){
							console.log("Error: "+error);
							}
						});

					};
				}
		},
		error: function(error) {
			console.log("Problems getting existing events");
		}
	});

});


/*

$("#submit_text").on("submit",function(e){
    e.preventDefault();
    var question_no = "";
    
    if (document.getElementById('Q_1').checked) {
		var question_no = "q1";
		};
    
    if (document.getElementById('Q_2').checked) {
		var question_no = "q2";
		};
		
	if (document.getElementById('Q_3').checked) {
		var question_no = "q3";
		};
	
	if (document.getElementById('Q_4').checked) {
		var question_no = "q4";
		};
	
	console.log("question selected is "+question_no);
	
	if (question_no == "") {
		
		alert("A question has not been selected.  Please select a question");
		
	} else {
    
    var ftextentry = $("#textentry").val();
    
    console.log(ftextentry);
    
    var ResponseText = Parse.Object.extend("ResponseText");
	var responseText = new ResponseText();
	
	responseText.set("course", "SPMD3052");
	responseText.set("qid", question_no);
	responseText.set("text",ftextentry);
	
	responseText.save(null, {
		success: function(responseText) {
			console.log("New response with objectID: " + responseText.id);
			alert("Your response has been posted");
		},
		error: function(responseText, error) {
			alert("Failed to create new object, with error code: " + error.description);
		}
		});
	
	};
	});
	*/
	
});

function get_questions(event){
	console.log("getting questions now for "+event.id);
	
	var Question = Parse.Object.extend("Question");
	var query = new Parse.Query(Question);
	query.equalTo("parent", event);
	
	query.find({
		success: function(results) {
			console.log("We found "+results.length+" questions for this");
			questions_list = [];
			for (var i=0;i<results.length;i++) {
				questions_list.push(results[i].get("Question"));
			}
			console.log(questions_list.length);
			return questions_list;
		},
		error: function(error){
			console.log("Error: "+error);
		}
	});
};