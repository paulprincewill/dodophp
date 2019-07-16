function dd_initialize() {
    
    var s = document.createElement("script");
    s.src = "https://paulprincewill.github.io/dodo/version.js?v=4";
    document.body.appendChild(s);
 
}

    
v = {
    no: '0.02',
    updated: '12/7/2019 03:02:00',
    last_checked: '12/7/2019 03:02:00'
}

check_version();

function check_version() {
       
    var version = v.no;
    if (version > "0.01") {
        dd('#version').html("You need to update from GitHub right now");
        dd('#version').style('backgroundColor','black');
        dd('#version').fadeIn(500);
    } else {
        
        setTimeout(function() {
            dd('#version').html("Your version is up to date");
            dd('#version').fadeIn(500);
        }, 2000);
        
        
        setTimeout(function() {
            dd('#version').fadeOut(1000);
        }, 4000);
    }
}
