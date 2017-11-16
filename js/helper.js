// helper.js 
// used for all functions and constants to be used in popup.js

// constants used for http request 
const URL = "https://aspc.pomona.edu/api/instructors/";
const COURSE_URL = "https://aspc.pomona.edu/api/courses/";
var list = true;
var buttons = true;

// set results
var list_result = ""
var course_result = ""
var result = "";
var	list_valid = true;
var	course_valid = true;
var loading = false;


// function to format a professor with no results
function noResults(input){
	// display and update the results
	list_result = "<h1 class='section_header'>Professors</h1>"
	document.getElementById('prof_title').disabled = true;

	// display a picture of Cecil!
	if (input == "Cecil Sagehen"){
		return result = "<img style='margin-top: 20px; margin-left: 120px;' src='/images/cecil.jpg'>";
	}
	return list_result += "<h6 style='margin-left: 15px;'>No professors named: " + input + "</h6>";

}

// function to format a professor with no results
function noCourseResults(input){
	// display and update the results
	course_result = "<hr><hr><h1 class='section_header'>Courses</h1>"
	document.getElementById('course_title').disabled = true;

	// return nothing if Cecil Sagehen as this case is handled by noResults()
	if (input == "Cecil Sagehen"){
		return ""
	}
	return course_result += "<h6 style='margin-left: 15px;'>No courses named: " + input + "</h6>";
}

// function that formats all results
// creates both a grid and list to make toggling between the two easier
function viewResults(hash){
	// reset the list results
	list_result = "<h1 class='section_header'>Professors</h1>"
	document.getElementById('prof_title').disabled = false;


	// go through all results returned by the query
	hash.forEach(function (review) {
		for (item in review){

			// print the name of the professor and the icon link to the ASPC reviews page
			if (item == "name") {
				// professor name
				list_result += "<span><hr><h4 class='prof_name'>" + review[item] + "</h4>";
				
				// information icon that takes you to the professor reviews link on ASPC site
				url = "https://aspc.pomona.edu/courses/browse/instructor/" + review['id'] + "/"
				list_result += "<a href='" + url + "' target='_blank'><i class='material-icons' style='font-size: 15px; float: right; margin-top: 10px; margin-right: 10px;'>&#xe88f;</i></a></span><div align='right'>"
			}
			// update the results based on all the fields
			else if (item != "id"){
				// get the rating and the field title
				var val = parseFloat(review[item]).toFixed(2);
				var title = item.charAt(0).toUpperCase() + item.split("_")[0].slice(1);

				// display no rating if there are no reviews 
				// display an empty progress bar for incomplete reviews
				if (isNaN(val)){

					if (item == 'rating'){
						list_result += "<p id='no_reviews'>There are no reviews yet!</p>";
						list_valid = false;
					}

					if (list_valid){
						progress = "<progress value='" + val + "' max='5'></progress>";				
						list_result += "<p>" + title + " " + progress + " N/A</p>";
					}

				}
				// display a progress bar with the value and the title
				else {								
					progress = "<progress value='" + val + "' max='5'></progress>";				
					list_result += "<p>" + title + " " + progress + " " + val + "</p>";
				}
			}
		}

		// close the div
		list_result += "</div>"	

		// reset the list to have valid reviews for new professor
		list_valid = true;

	})

	// based on selection - display the results accordingly
	return list_result
}



// function that formats all results
// creates both a grid and list to make toggling between the two easier
function viewCourseResults(hash){
	// reset the list results
	course_result = "<hr><hr><h1 class='section_header'>Courses</h1>"
	document.getElementById('course_title').disabled = false;

	
	// go through all results returned by the query
	hash.forEach(function (review) {
		for (item in review){

			if (item == "name") {
				// professor name
				course_result += "<span><hr><h4 class='prof_name'>" + review[item] + "</h4>";
				// information icon that takes you to the professor reviews link on ASPC site
				url = "https://aspc.pomona.edu/courses/browse/course/" + review['code'].replace(/\s+/g, '-') + "/"
				course_result += "<a href='" + url + "' target='_blank'><i class='material-icons' style='font-size: 15px; float: right; margin-top: 10px; margin-right: 10px;'>&#xe88f;</i></a></span>"
				course_result += "<br><h6 class='class_code'>" + review["code"] + "</h6><div align='right'>";

			}
			// make sure item is a valid rating item and not extra information
			else if (item != "id" && item != "department" && item != "number" && item != "code"){
				// get value and title
				var val = parseFloat(review[item]).toFixed(2);
				var title = item.charAt(0).toUpperCase() + item.split("_")[0].slice(1);


				if (isNaN(val)){
					// either print out that there are no reviews or
					// print an incomplete progress bar
					if (item == 'rating'){
						course_result += "<p id='no_reviews'>There are no reviews yet!</p>";
						course_valid = false;
					}

					if (course_valid){
						progress = "<progress value='" + val + "' max='5'></progress>";				
						course_result += "<p>" + title + " " + progress + " N/A</p>";
					}

				}
				// display the progress bar with the value and the title
				else {								
					progress = "<progress value='" + val + "' max='5'></progress>";				
					course_result += "<p>" + title + " " + progress + " " + val + "</p>";
				}
			}
		}

		// close the div
		course_result += "</div>"	

		// reset the list to have valid reviews for new professor
		course_valid = true;

	})

	// based on selection - display the results accordingly
	return course_result
}
