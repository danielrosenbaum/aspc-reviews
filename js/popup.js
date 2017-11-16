// popup.js

// Add the listener for the submit button
document.addEventListener('DOMContentLoaded', init);

// declares all the listeners
function init() {

	// add listener for enter key and to allow user to press enter
	document.getElementById('input').addEventListener('keypress', function (e) {
    	var key = e.which || e.keyCode;
    	 // 13 is enter
    	if (key === 13) {
    		makeQuery();
    	}
	});     

}

// makes the http request to get information 
function makeQuery() {

	// display the buttons
    addTitles()	

	// scroll back to the top of the results on each query
	$('html, body').animate({
	        scrollTop: $("#print_result").offset().top - 48
	    }, 1000);

	// de-select both buttons
	$("#course_title").removeClass('selected_header')
	$("#prof_title").removeClass('selected_header')
	loading = true;

	// add the loading spinner while the query is being made
	loading_spinner = "<div class='loader'>Loading...</div>"
	document.getElementById("print_result").innerHTML = loading_spinner;
	
	// get the input from the text field
	var input = document.getElementById('input').value;
 
	// create request and request url for both professor and course reviews
	var xmlHttp = new XMLHttpRequest();
	var xmlHttpCourse = new XMLHttpRequest();
	var request = URL + input + TOKEN;
	var course_request = COURSE_URL + input + TOKEN;

	// function that handles any state changes for the Professor query
	xmlHttp.onreadystatechange = function() {
    	// success
    	if (xmlHttp.readyState==4 && xmlHttp.status==200){
        	var msg = xmlHttp.responseText;
        	format(msg, input)
    	}
    	// 404 Error
    	else if (xmlHttp.readyState==4 && xmlHttp.status==404){
    		document.getElementById("print_result").innerHTML = "<h6>That page couldn't be found - please try again.</h6>"
    	}
    	// 502 Error
    	else if (xmlHttp.readyState==4 && xmlHttp.status==502){
    		document.getElementById("print_result").innerHTML = "<h6>The ASPC Site may be down. Sorry for the inconvienance - please try again.</h6>"
    	}
	}

	// function that handles any state changes for the Courses query
	xmlHttpCourse.onreadystatechange = function() {
    	// success
    	if (xmlHttpCourse.readyState==4 && xmlHttpCourse.status==200){
        	var msg = xmlHttpCourse.responseText;
        	course_format(msg, input)
    	}
    	// 404 Error
    	else if (xmlHttpCourse.readyState==4 && xmlHttpCourse.status==404){
    		document.getElementById("print_result").innerHTML = "<h6>That page couldn't be found - please try again.</h6>"
    	}
    	// 502 Error
    	else if (xmlHttpCourse.readyState==4 && xmlHttpCourse.status==502){
    		document.getElementById("print_result").innerHTML = "<h6>The ASPC Site may be down. Sorry for the inconvienance - please try again.</h6>"
    	}
	}

	// open the connection for both requests
	xmlHttp.open("GET", request, true);
	xmlHttpCourse.open("GET", course_request, true);

	// set timeout to 7 seconds and function that handles timeouts
	xmlHttp.timeout = 7000;
	xmlHttpCourse.timeout = 7000;
	xmlHttp.ontimeout = function(){
		document.getElementById("print_result").innerHTML = "<h6>This is taking too long - please try again.</h6>"
	}
	xmlHttpCourse.ontimeout = function(){
		document.getElementById("print_result_courses").innerHTML = "<h6>This is taking too long - please try again.</h6>"
	}

	// catch all other errors 
	xmlHttp.onerror = function(){
		document.getElementById("print_result").innerHTML = "<h6>There seems to be an error - please try again.</h6>"
	}
	xmlHttpCourse.onerror = function(){
		document.getElementById("print_result_courses").innerHTML = "<h6>There seems to be an error - please try again.</h6>"
	}
	xmlHttp.send(null);
	xmlHttpCourse.send(null);
}


// get the response then format and print to html 
function format(responses, input){

	// parse string return to json hash 
	var hash = JSON.parse(responses)

	// depending on the return json display results or no results
	result = hash.length === 0 ? noResults(input) : viewResults(hash);

	// display results to html for all to see!
	document.getElementById("print_result").innerHTML = result;
	document.getElementById("footer").style.display = 'block';

	loading = false;
}

// get the response then format and print to html 
function course_format(responses, input){
	// parse string return to json hash 
	var hash = JSON.parse(responses)

	// depending on the return json display results or no results
	course_result = hash.length === 0 ? noCourseResults(input) : viewCourseResults(hash);

	// display results to html for all to see!
	document.getElementById("print_result_courses").innerHTML = course_result;
	document.getElementById("footer").style.display = 'block';

	loading = false;
}

// function that adds the buttons to the page
function addTitles(){
	document.getElementById("titles").innerHTML = "<button id='prof_title' class='title_header'>Professors</button><br><button id='course_title' class='title_header'>Courses</button>"
	
	// add functionality on click to scroll to the desired section
	// also update which button is selected and unselected
	$("#prof_title").click(function() {
    	$('html, body').animate({
        	scrollTop: $("#print_result").offset().top - 48
    	}, 1000);
    	$("#prof_title").addClass('selected_header');
    	$("#course_title").removeClass('selected_header');

	});
	$("#course_title").click(function() {
    	$('html, body').animate({
        	scrollTop: $("#print_result_courses").offset().top - 40
        }, 1000);
        $("#course_title").addClass('selected_header');
        $("#prof_title").removeClass('selected_header');

	});

	// addButtons shall only do something the first time it is called - so it does not continually add buttons
	addTitles = function(){};
}
