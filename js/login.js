jQuery(document).ready(function($) {
    
    		Parse.initialize("0fDoU3tixdDTgs3iGWxjWdsbN8EsyjE6wFwtMy7j","CQTCCMfGXwyPbukMSAoawLCxemrcqor6urIypgCs");
    
    
    $(".existing").hide();
    $(".newuser").hide();
    
    $("#exist_user_open").click(function(){
	    $(".newuser").hide();
	    $(".existing").show();

    });

    
    $("#new_user_open").click(function(){
	    $(".newuser").show();
	    $(".existing").hide();

    });

    
    $("#signin").click(function(){
    
		event.preventDefault();
	   
	   var uName = $('#uName').val();
	   var pWord = $('#pWord').val();
	   console.log(uName + pWord);
    
	   Parse.User.logIn(uName, pWord, {
		   
		   success: function(user) {
			   console.log("You have logged in");
			   window.location.href="admin.html";
			   },
			   
			   error: function(user, error) {
				   console.log("Fail "+error.code+" "+error.message);
				   }
		});
	});
	   

    
    
    
    $("#register").click(function(){
    
    	event.preventDefault();
    	
    	var uName = $('#uName2').val();
		var pWord = $('#pWord2').val();
		var pWordCheck = $('#pWord_check').val();
		var uEmail = $('#uEmail').val();
		
		if (pWord !== pWordCheck) {
			alert("Your passwords do not match.  Please try again.")
		}
		else
		{
			var AllowedUsers = Parse.Object.extend("allowed_users");
			var query = new Parse.Query(AllowedUsers);
			query.equalTo("email", uEmail);
			query.find({
				success: function(results) {
					console.log("Email address found: "+results.length);
					
					if (results.length > 0) {
					
						var user = new Parse.User();
						user.set("username", uName);
						user.set("password", pWord);
						user.set("email", uEmail);
		
						user.signUp(null, {
							success: function(user) {
								console.log("Registered");
								window.location.href="admin.html";
								},
							error: function(user, error) {
								// Show the error message somewhere and let the user try again.
								alert("Error: " + error.code + " " + error.message);
								},
						});
					}
					else
					{
						alert("You do not have permission to register");
					}
				},
				error: function(error) {
					alert("You do not have permission to register");
				}
			});
			
		}
	});	

    
});