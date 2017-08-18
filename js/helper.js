// helper.js 
// used for all functions and constants to be used in popup.js

// constants used for http request 
const URL = "https://aspc.pomona.edu/api/instructors/";
var list = true;
var buttons = true;

// set results
var list_result = ""
var grid_result = ""
var result = "";
var	list_valid = true;
var loading = false;


// function to format a professor with no results
function noResults(input){
	// display and update the results
	list_result = ""
	grid_result = ""

	if (input == "Cecil Sagehen"){
		return result = "<img style='margin-top: 10px; margin-left: 100px;' src='/cecil.jpg'>";
	}
	return result = "<h6>No professors named: " + input + "</h6>";

}

// function that formats all results
// creates both a grid and list to make toggling between the two easier
function viewResults(hash){
	// reset the grid and list results
		grid_result = "<table id='result_table' style='width: 785px; margin-top: 7px;'><thead><tr>" +
			"<th class='name'>Professor</th>" +
			"<th class='rating'>Rating</th>" +
			"<th class='useful_rating'>Usefulness</th>" + 
			"<th class='engagement_rating'>Engagement</th>" +
			"<th class='difficulty_rating'>Difficulty</th>" +
			"<th class='competency_rating'>Competency</th>" + 
			"<th class='lecturing_rating'>Lecturing</th>" + 
			"<th class='enthusiasm_rating'>Enthusiasm</th>" +
			"<th class='approachable_rating'>Approachability</th>" +
			"<th class='inclusivity_rating'>Inclusivity</th></tr></thead>" +
			"<tbody><tr>";

		list_result = ""
		
		// go through all results returned by the query
		hash.forEach(function (review) {
			for (item in review){

				if (item == "name") {
					// professor name
					list_result += "<span><hr><h4 class='prof_name'>" + review[item] + "</h4>";
					
					// information icon that takes you to the professor reviews link on ASPC site
					url = "https://aspc.pomona.edu/courses/browse/instructor/" + review['id'] + "/"
					list_result += "<a href='" + url + "' target='_blank'><i class='material-icons' style='font-size: 15px; float: right; margin-top: 10px; margin-right: 10px;'>&#xe88f;</i></a></span><div align='right'>"
					
					// add professor to grid and make their name clickable (to take you to the ASPC link)
					grid_result += "<td class='" + item + "'><a id='grid_name' href='" + url + "' target='blank'>" + review[item] + "</a></td>";


				}
				else if (item != "id"){
					var val = parseFloat(review[item]).toFixed(2);
					var title = item.charAt(0).toUpperCase() + item.split("_")[0].slice(1);


					if (isNaN(val)){

						grid_result += "<td class='" + item + "'>--</td>";

						if (item == 'rating'){
							list_result += "<p id='no_reviews'>There are no reviews yet!</p>";
							list_valid = false;
						}

						if (list_valid){
							progress = "<progress value='" + val + "' max='5'></progress>";				
							list_result += "<p>" + title + " " + progress + " N/A</p>";
						}

					}
					else {								
						progress = "<progress value='" + val + "' max='5'></progress>";				
						list_result += "<p>" + title + " " + progress + " " + val + "</p>";
						grid_result += "<td class='" + item + "'>" + val + "</td>";
					}
				}
			}

			// update the grid by closing a row and openning a new one
			grid_result += "</tr><tr>";
			list_result += "</div>"	

			// reset the list to have valid reviews for new professor
			list_valid = true;

		})

		// end the grid 
		grid_result += "</tbody></table>";

		// based on selection - display the results accordingly
		return result = list ? list_result : grid_result
}


// function used to sort the table by column header
function sortTable(n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

	table = document.getElementById("result_table");

	switching = true;

	//Set the sorting direction
	// should be asc for prof name and desc for all other headers
	dir = n == 0 ? "asc" : "desc"

	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	//start by saying: no switching is done:
		switching = false;
		rows = table.getElementsByTagName("tr");

		for (i = 1; i < (rows.length - 2); i++) {
			//start by saying there should be no switching:
			shouldSwitch = false;
			/*Get the two elements you want to compare,
			one from current row and one from the next:*/
			if (n > 0){
				x = rows[i].getElementsByTagName("td")[n].innerHTML.toLowerCase();
		      	y = rows[i + 1].getElementsByTagName("td")[n].innerHTML.toLowerCase();
	      	}
	      	else {
	      		x = rows[i].getElementsByTagName("td")[n].getElementsByTagName("a")[0].innerHTML
	      		y = rows[i + 1].getElementsByTagName("td")[n].getElementsByTagName("a")[0].innerHTML
	      	}
			/*check if the two rows should switch place,
			based on the direction, asc or desc:*/
			if (dir == "asc") {
				if (x > y) {
					//if so, mark as a switch and break the loop:
					shouldSwitch= true;
					break;
				}
			} else if (dir == "desc") {
				if (x < y) {
					//if so, mark as a switch and break the loop:
					shouldSwitch= true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			/*If a switch has been marked, make the switch
			and mark that a switch has been done:*/
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			//Each time a switch is done, increase this count by 1:
			switchcount ++; 
		} else {
			/*If no switching has been done AND the direction is "asc",
			set the direction to "desc" and run the while loop again.*/
			if (switchcount == 0 && dir == "desc") {
				dir = "asc";
				switching = true;
			}
			else if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}