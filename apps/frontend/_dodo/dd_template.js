function dd_setTemplate() {
     // This section get things ready for internal pages and templates
    var pages = document.querySelectorAll("ddpage, ddtemplate");
    for (var i = 0; i < pages.length; i++) {
        var body = document.querySelector("body");
        body.appendChild(pages[i]);
    }
}

function dd_template(template) {
    var self = {};
	self.copy = function() {
        return document.querySelector("ddtemplate[for='"+template+"']").innerHTML;
    }
    
    return self;

}