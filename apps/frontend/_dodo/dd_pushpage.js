function dd_checkForHashPage(callback) {
    var hash = window.location.hash.slice(1);
    if (hash != '') {
        var pageExists = document.querySelector("ddpage[url='hash_"+hash+"']");
        if (pageExists) {
            dd_pushPage(hash,'internal');
        }
    } else {
        
        var current = document.querySelector('main').id;
        var url = window.location.href;
 		url = url.split('#');
 		var initialPage = url[0].split('/');
 		initialPage = initialPage[initialPage.length-1];
        
        var initialPageExists = document.querySelector("ddpage[url='page_"+initialPage+"']");
        
        if (current != initialPage && initialPageExists) {
            dd_pushPage(initialPage, 'initial');
        }
    }

}


// This function is obvious isn't it 
function dd_pushPage(page, page_type) {
    
    if (typeof page_type ==='undefined') {
        page_type = 'external';
    }
    
    if (page_type=='internal') {
        var page_url = 'hash_'+page;
    } else {
        var page_url = 'page_'+page;
    }
    
    var main = document.querySelector("main");
    var current_id = main.id;
    var current_page = main.innerHTML;
    // Hide the current page so the user does not see what is going on
    dd(main).hide(); 
    
     // Keep the current page in a seperate container
    var pageContainer = document.querySelector("ddpage[url='"+current_id+"']");
    if (!pageContainer) { // If we can't find any container, create one
        var pageContainer = document.createElement("ddpage");  
        pageContainer.style = "display: none";
        pageContainer.setAttribute('url',current_id);
        document.querySelector("body").appendChild(pageContainer);
    }
    
    // Then we transfer each element one by one
    // We use this approach because we want to keep the event listeners active
    pageContainer = document.querySelector("ddpage[url='"+current_id+"']");
    while (main.hasChildNodes()) { pageContainer.appendChild(main.firstChild); }
    
    // Replace it with this new page
    var newPage = document.querySelector("ddpage[url='"+page_url+"']");
    while (newPage.hasChildNodes()) { main.appendChild(newPage.firstChild); }
    
 
    
    // Finally, change the url of the page
    if (page_type == 'internal') {
        page = '#'+page;
       window.history.pushState({page: page}, page, page);
    } else {
        window.history.pushState({page: page}, page, page);
        
    }
    
    // Change the id of this new page
    main.id = page_url;
    
    // Only show when page is ready
    dd(main).fadeIn(500);
    

}
