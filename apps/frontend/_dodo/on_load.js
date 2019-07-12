function dd_init() {
   
    window.onhashchange = function() {
        dd_checkForHashPage();
    }
    
    // This section get things ready for dd_push links
    var ele = document.querySelectorAll("[dd_if], [dd_hide]");
    for (var i = 0; i < ele.length; i++) {
        dd(ele[i]).hide();
    }
    
    
    dd_setTemplate();
    dd_setPush();
    dd_setClone();
    dd_setSubmit();
    dd_setLoad();
    dd_setAjax();
    
    // We have to check for hash page before we remove the loader
    dd_checkForHashPage();

    // Remove the loader, if any
    var loader = dd('dd_loader [dd_onload]');
    if (loader.select()) {
        loader.show();
        setTimeout(function() {
            loader.fadeOut(500)
        }, 500);
    }
    
    // custom initialize from programmer
    window.addEventListener('DOMContentLoaded', function() {
        
        dd_initialize();
    });
}


dd_init();


