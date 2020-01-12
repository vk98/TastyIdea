$(document).ready(function () {
	$('#formTitle').addClass('shake-rotate');
	setTimeout(function () {
		$('#formTitle').removeClass('shake-rotate')
	}, 800)
});
var ingredientsCollection = [];
var inputVal = document.getElementById('ingredientsInput').value;
var listCounter = 1;

function main() {
	//Create API parameters based on ingredients inputed
	let foodsString = ingredientsCollection.join();
	var upToIngredients = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=';
	var afterIngredients = '&number=200&limitLicense=false&fillIngredients=true&ranking=1&limitLicense=false&mashape-key=btSAgzlS6CmshxyNyEh24vDF8sl2p1w43h9jsnCABHsQZSfxx6'

	//Get recipes for specific ingredients from API 
	var searchByIngredients = new XMLHttpRequest();
	searchByIngredients.open("GET", upToIngredients + foodsString + afterIngredients, false);
	searchByIngredients.send();

	//Parse what API returns (in JSON)
	var recipes = JSON.parse(searchByIngredients.response);

	//Create arrays for HTML creation
	var recipeDiv;
	var ingredientsMissing;
	var name;
	var img;
	var description;
	var descriptionText;
	var clickPart;
	var likes;

	recipeWrapper = document.createElement("div");
	recipeWrapper.setAttribute("class", "recipeWrapper");
	recipeWrapper.setAttribute("id", "recipeWrapper");
	recipeContainer = document.createElement("div");
	recipeContainer.setAttribute("class", "recipeContainer");

	if (document.getElementsByClassName("recipeWrapper") !== null) {
		$(".recipeWrapper").remove();
	}

	for (var i = 0; i < recipes.length; i++) {
		//Create divs so you get a div for each recipe
		recipeDiv = $("<div>")
			.addClass("recipeBlock")
			.attr("id", i);

		//Create spans to contain name of dish; and create and append the actual name of dish to said span
		name = $("<span/>")
			.addClass("name")
			.html(recipes[i].title);
		sessionStorage.setItem('title' + i, recipes[i].title);

		//Create img tags to contain image;
		img = $("<img/>")
			.addClass("img")
			.attr("src", recipes[i].image);
		sessionStorage.setItem('imageURL' + i, recipes[i].image);

		//Create spans with id to contain number and names of missing ingredients
		ingredientsMissing = $("<div/>").addClass("ingredientsMissing");
		//Add names of missing ingredients only if there are any
		if (recipes[i].missedIngredients.length == 0) {
			ingredientsMissing.html("<b>You have all the ingredients!</b>");
		} else {
			ingredientsMissing.html("<b>" + recipes[i].missedIngredients.length + " " + "ingredients missing:</b></br>");
			var x = [];
			for (var j = 0; j < recipes[i].missedIngredients.length; j++) {
				x[j] = recipes[i].missedIngredients[j].name;
				ingredientsMissing.append(x[j]);
				if (j !== recipes[i].missedIngredients.length - 1) {
					ingredientsMissing.append(", ");
				}
			}
		};

		//Create divs to contain number of likes
		likes = $("<div/>").addClass("likes");
		likes.html("<b>Likes</b> " + recipes[i].likes);

		//Create anchor tags to make the recipe blocks clickable
		clickPart = $("<a/>").addClass("clickPart");
		var url = "recipePage.html?id=" + recipes[i].id;
		clickPart.attr("href", url);

		//Append all parts of recipe blocks to recipe blocks
		recipeDiv.append(clickPart)
			.append(name)
			.append(img)
			.append(likes)
			.append(ingredientsMissing);

		//Append recipe blocks to container
		$(recipeContainer).append(recipeDiv);
	}


	//Append recipe container to recipe wrapper and that to DOM (now recipes are visible)
	recipeWrapper.append(recipeContainer);
	$('body').append(recipeWrapper);

	//Isotope initiation (grid format)
	// $('.recipeWrapper').imagesLoaded(function() {

	$('.recipeWrapper').isotope({
		itemSelector: 'div.recipeBlock',
		columnWidth: 'div.recipeBlock'
	});

	//Scroll down on when recipes ready
	$('html,body').animate({
		scrollTop: $(".recipeContainer").offset().top
	}, 1500);
	// });

	let win = $(window);
	let search = $("#search");

	win.on("scroll", function () {
		let top = win.scrollTop() / 2;
		search.css("transform", "rotate(" + top + "deg)");
	});

};

function add() {
	inputVal = document.getElementById('ingredientsInput').value;
	if (inputVal != "") {
		ingredientsCollection.push(inputVal);
		var list = document.getElementById('notes');

		var element = document.createElement("li");
		var paragraph = document.createElement("p");
		var node = document.createTextNode(listCounter + ". " + inputVal);
		paragraph.appendChild(node);
		element.appendChild(paragraph);
		list.appendChild(element);

		document.getElementById('ingredientsInput').value = "";
		listCounter++;
	}

};

function autocomplete(inp, arr) {
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function (e) {
		var a, b, i, val = this.value;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) { return false; }
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				b.addEventListener("click", function (e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function (e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) { //down
			currentFocus++;
			addActive(x);
		} else if (e.keyCode == 38) { //up
			currentFocus--;
			addActive(x);
		} else if (e.keyCode == 13) { //enter
			e.preventDefault();
			if (currentFocus > -1) {
				if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);

		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}
