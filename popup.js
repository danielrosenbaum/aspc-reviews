// popup.js

// Add the listener for the submit button
document.addEventListener('DOMContentLoaded', init);

// declares all the listeners
function init() {

	// add listener for enter key and to allow user to press enter
	document.getElementById('input').addEventListener('keypress', function (e) {
    	var key = e.which || e.keyCode;
    	if (key === 13) { // 13 is enter
    		makeQuery();
    		addButtons()
    	}
	});     

}

// add buttons to the display
function addButtons(){
	document.getElementById("buttons_div").style.display = 'block'
	addButtonListeners()

	// addButtons shall only do something the first time it is called - so it does not continually add buttons
	addButtons = function(){};
}

// makes the http request to get information 
function makeQuery() {

	loading = true;

	loading_spinner = "<div class='loader'>Loading...</div>"
	document.getElementById("print_result").innerHTML = loading_spinner;
	
	// get the input from the text field
	var input = document.getElementById('input').value;

	// create request and request url
	var xmlHttp = new XMLHttpRequest();
	var request = URL + input + TOKEN

	// function that handles any state changes
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

	// open the connection
	xmlHttp.open("GET", request, true);

	// set timeout to 7 seconds and function that handles timeouts
	xmlHttp.timeout = 7000;
	xmlHttp.ontimeout = function(){
		document.getElementById("print_result").innerHTML = "<h6>This is taking too long - please try again.</h6>"
	}

	// catch all other errors 
	xmlHttp.onerror = function(){
		document.getElementById("print_result").innerHTML = "<h6>There seems to be an error - please try again.</h6>"
	}

	// respond with null
	xmlHttp.send(null);

}


// get the response then format and print to html 
function format(responses, input){

	// parse string return to json hash 
	var hash = JSON.parse(responses)

	result = hash.length == 0 ? noResults(input) : viewResults(hash);

	// display results to html for all to see!
	document.getElementById("print_result").innerHTML = result;
	document.getElementById("footer").style.display = 'block';


	if (!list){
		for (index = 0; index < 10; index++){
			addColumnListeners(index);
		}
	}

	loading = false;

}


// switch between either list or grid view depending on click
function changeFormat(){

	if (!loading){
		if (list_result != "" && list){
			result = list_result;
			document.getElementById("print_result").innerHTML = result;
		}
		else if (grid_result != "" && !list){
			result = grid_result;
			document.getElementById("print_result").innerHTML = result;

			// add listeners for each column header
			for (var index = 0; index < 10; index++){
				addColumnListeners(index);
			}
		}
	}
}

// add a listener for each column based on id
function addColumnListeners(index){
	var hdrs = document.getElementsByTagName('th')

	hdrs[index].addEventListener('click', function () {
		sortTable(index)
	});
}


function addButtonListeners(){
	//add listener for type of format (list or grid)
	document.getElementById('list_button').addEventListener('click', function () {
		list = true;

		// update button display
		document.getElementById('list_button').disabled = true;
		document.getElementById('grid_button').disabled = false;

		changeFormat()
	}); 

	document.getElementById('grid_button').addEventListener('click', function () {
		list = false;

		// update button display
		document.getElementById('grid_button').disabled = true;
		document.getElementById('list_button').disabled = false;

		changeFormat()
	}); 
}
