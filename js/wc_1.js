jQuery(document).ready(function($) {
    
    Parse.initialize("0fDoU3tixdDTgs3iGWxjWdsbN8EsyjE6wFwtMy7j", "CQTCCMfGXwyPbukMSAoawLCxemrcqor6urIypgCs");
    
    var ignore = [
						' and ',
						' the ',
						' to ',
						' a ',
						' of ',
						' for ',
						' as ',
						' i ',
						' with ',
						' it ',
						' is ',
						' on ',
						' that ',
						' this ',
						' can ',
						' in ',
						' be ',
						' has ',
						' if ',
						'[+]',
						'[-]',
						'&',
						'1.',
						'2.',
						'3.',
						'4.'];
						
	var arr=[];
	var complete_phrase_arr=[];
	var options = {};
	var $canvas = $('#canvas');
    var $htmlCanvas = $('#html-canvas');
    
    
    $("#get_responses").click(function() {
    
    	var compiled_text = "";
    	var arr=[];
    	var complete_phrase_arr=[];
    	var options = {};
    
    	//alert("Get responses has been clicked");
    	
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
	
			var ResponseText = Parse.Object.extend("ResponseText");
			var query = new Parse.Query(ResponseText);
	
			query.equalTo("qid", question_no);
			query.find({
				success: function(results) {
					document.getElementById("responses_count").value = "Retrieved " + results.length + " responses.";
					for (var i = 0; i < results.length; i++) {
						var object = results[i];
						compiled_text += object.get("text")+" ";
						}
					//console.log(compiled_text);
					compiled_text = compiled_text.toLowerCase();
					
					// removing unwanted words
					/*var ignore = [
						' and ',
						' the ',
						' to ',
						' a ',
						' of ',
						' for ',
						' as ',
						' i ',
						' with ',
						' it ',
						' is ',
						' on ',
						' that ',
						' this ',
						' can ',
						' in ',
						' be ',
						' has ',
						' if ',
						'[+]',
						'[-]',
						'&']; */
					var iCount = ignore.length;
					for (var i=0;i<iCount;i++){
						var target_word = ignore[i];
						compiled_text = compiled_text.replace(new RegExp(target_word, 'g'), ' ');
						console.log("removed "+ignore[1]);
					};
					
					document.getElementById("text_output").value = compiled_text;
					//console.log(compiled_text);
					
					//console.log("responses: "+compiled_text);
	
					var words = (function(){
			 
						var sWords = compiled_text.trim().replace(/[,;.]/g,'').split(/[\s\/]+/g).sort();
						var iWordsCount = sWords.length; // count w/ duplicates
				
						console.log("word count: "+iWordsCount);
						console.log("sWords: "+sWords);
			 
						// array of words to ignore
						/*var ignore = ['and','the','to','a','of','for','as','i','with','it','is','on','that','this','can','in','be','has','if'];*/
						
						ignore = (function(){
								var o = {}; // object prop checking > in array checking
								var iCount = ignore.length;
								for (var i=0;i<iCount;i++){
									o[ignore[i]] = true;
									}
								return o;
						}());
						
						// add phrases to swords
						var compiled_text_phrases = compiled_text.trim().replace(/[,;.]/g,'').split(/[\s\/]+/g);
						var compiled_text_phrases_length = compiled_text_phrases.length;
						
						for (var i=0; i<(compiled_text_phrases_length-1); i++) {
							var first_word = compiled_text_phrases[i];
							var second_word = compiled_text_phrases[i+1];
							if (!ignore[first_word] || !ignore[second_word]) {
								var phrase = first_word+" "+second_word;
								sWords.push(phrase);	
							}
						}
						
						console.log("sWords with phrases: "+sWords);
						console.log("number of words/phrases: "+sWords.length);
						
						var text_number = sWords.length;
						var counts = {}; // object for math
							for (var i=0; i<text_number; i++) {
								//console.log("First version of sWord is: "+sWords[i]);
								var sWord = sWords[i];
								if (!ignore[sWord]) {
									counts[sWord] = counts[sWord] || 0;
									counts[sWord]++;
								}
							}
			 
						//var arr = []; // an array of objects to return
							for (sWord in counts) {
								//console.log("sWord is: "+sWord);
								arr.push({
									text: sWord,
									frequency: counts[sWord]
								});
							}
			 
						// sort array by descending frequency | http://stackoverflow.com/a/8837505
						return arr.sort(function(a,b){
							return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
						});
			 
					}());
					
					(function(){
						var iWordsCount = words.length; // count w/o duplicates
						for (var i=0; i<iWordsCount; i++) {
							var word = words[i];
							console.log(word.frequency, word.text);
							var phrase_arr = [word.text, word.frequency];
							console.log(phrase_arr);
							complete_phrase_arr.push(phrase_arr);
						}
					}());
					
					console.log("at the end of the success function");
					//console.log(complete_phrase_arr);
					var list = complete_phrase_arr;
					//console.log(list);
					options.list = list;
					options.gridSize = 12;
					options.weightFactor = 10;
					
					WordCloud(document.getElementById('canvas'), options);
					
				}, //end success
					
				error: function(error) {
					alert("Error" + error.code + " " + error.message);
				} //end error
				
			});
		};
	});
	
	$('#btn-save').on('click', function save(evt) {
      var url = $canvas[0].toDataURL();
      if ('download' in document.createElement('a')) {
        this.href = url;
      } else {
        evt.preventDefault();
        alert('Please right click and choose "Save As..." to save the generated image.');
        window.open(url, '_blank', 'width=500,height=300,menubar=yes');
      }
    });
    
});