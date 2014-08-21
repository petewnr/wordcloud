jQuery(document).ready(function($) {
    
    		Parse.initialize("0fDoU3tixdDTgs3iGWxjWdsbN8EsyjE6wFwtMy7j","CQTCCMfGXwyPbukMSAoawLCxemrcqor6urIypgCs");
    		
var currentUser = Parse.User.current();

if (currentUser) {

	var findexistingevents = Parse.Object.extend("Event");
	var query = new Parse.Query(findexistingevents);
	query.equalTo("parent", currentUser);
	
	query.find({
		success: function(results_events) {
			console.log("existing events for user is "+results_events.length);
			for (i=0;i<results_events.length;i++) {
				var code = results_events[i].get("event_code");
				var details = results_events[i].get("event_details");
				var status = results_events[i].get("Status");
				$('#existing_events').append("<tr><td><span class='e_code'>"+code+"</span></td><td>"+details+"</td><td>"+status+"</td><td><button value='"+code+"' class='btn btn-xs btn-warning' name='change_status_btn' type='submit'>Change</button></td></tr>");
			};
		},
		error: function(error) {
			console.log("Problems getting existing events");
		}
	});
	
	$('body').on("click", "button[name=change_status_btn]", function(){
		var change_event_code = ($(this).attr("value"));
		console.log("button clicked "+change_event_code);
		
		var findevent = Parse.Object.extend("Event");
		var query = new Parse.Query(findevent);
		query.equalTo("event_code", change_event_code);
	
		query.find({
			success: function(find_result) {				
				
				if (find_result[0].get("Status") == "open") {
					var new_status = "closed";
				} else {
					var new_status = "open";
				};
				find_result[0].save(null, {
					success: function(find_result) {
						find_result.set("Status", new_status);
						find_result.save({
							success: function(msg){
								location.reload();
								},
							error: function(msg){
								console.log("Error: cannot save change");
							}
						});
					}
				});
				},
			error: function(error) {
				console.log("Error: Data mismatch error");
				}
		
		});
	});
	
	$("#q_save").click(function(){
    
		event.preventDefault();
		
		var event_code = $('#event_code').val();
		var event_details = $('#event_details').val();
		var q1 = $('#q_text_1').val();
		var q2 = $('#q_text_2').val();
		var q3 = $('#q_text_3').val();
		var q4 = $('#q_text_4').val();
		var q5 = $('#q_text_5').val();
		
		var Event = Parse.Object.extend("Event");
		var Question = Parse.Object.extend("Question");
		
		var newEvent = new Event();
		newEvent.set("event_code", event_code);
		newEvent.set("event_details", event_details);
		newEvent.set("parent", currentUser);
		newEvent.set("Status", "open");
		
		
		if (q1 !== "") {
			var newQuestion1 = new Question();
			newQuestion1.set("Question", q1);
			newQuestion1.set("parent", newEvent);
			newQuestion1.save({
				success: function(saveresult) {
					
					console.log("event created and first question saved");
					
					var findEvent = Parse.Object.extend("Event");
					var query = new Parse.Query(findEvent);
			
					query.equalTo("event_code", event_code);
					query.find({
						
						success: function(results){
						
							console.log("searched for event code");
							console.log(results.length);
							
							var object = results[0];
							console.log(object.id);
						
							if (results.length == 1) {
								//var object = results[0];
								console.log("event code has been found")
								
								if (q2 !== "") {
									var newQuestion2 = new Question();
									newQuestion2.set("Question", q2);
									newQuestion2.set("parent", object);
									newQuestion2.save();
								};
								if (q3 !== "") {
									var newQuestion3 = new Question();
									newQuestion3.set("Question", q3);
									newQuestion3.set("parent", object);
									newQuestion3.save();
								};
								if (q4 !== "") {
									var newQuestion4 = new Question();
									newQuestion4.set("Question", q4);
									newQuestion4.set("parent", object);
									newQuestion4.save();
								};
								if (q5 !== "") {
									var newQuestion5 = new Question();
									newQuestion5.set("Question", q5);
									newQuestion5.set("parent", object);
									newQuestion5.save();
								};
								location.reload();
							} else {
								alert("Error: duplicate event codes");
							}
						},
						error: function(error) {
							alert("Error: event does not exist");
						}
					});
							
				},
				error: function(error) {
					alert("q1 is empty");
				}
			});
			
		} else {
			alert("Please enter a question into the first question box");
		}
	 });

	
} else {
	
	console.log("Kick the user out");
	window.location.href="index.html";
	
}
});

