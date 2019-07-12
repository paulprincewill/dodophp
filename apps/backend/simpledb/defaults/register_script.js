
var register = select('#register #submit button');
register.addEventListener("click", function(){ 

	var data= inputs('$js');

	ajax({
		url: "apps/backend/register/main.php", 
		data: data, 
		if_ajax_works: function(response) {
	
			if (response == "success") {
				window.location.href = "home";
			}

			else {
				select("#register .error").innerHTML = response;
			}
		}
	})
});
