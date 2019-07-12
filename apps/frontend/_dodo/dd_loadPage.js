function dd_setPush() {
    // This section get things ready for dd_push links
    var links = document.querySelectorAll("a[dd_push]");
    for (var i = 0; i < links.length; i++) {
       
        links[i].addEventListener('click', function(e) {

            e.preventDefault(); // Stop the browser from loading link
            var url = links[i].getAttribute("href"); // Get the link location
            dd_loadPage(url);

        });
    }
}

function dd_loadPage(url) {
	// convert to absolute url
		var full_url = document.createElement('a');
    	full_url.href = url;
    	full_url = full_url.cloneNode(false).href;
	alert(url+" WIll be loaded shortly")
}