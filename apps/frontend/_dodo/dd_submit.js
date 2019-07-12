function dd_setSubmit() {
    
    // This whole section is to get things ready for forms to be submitted automatically
	var forms = document.querySelectorAll("form[dd_submit]");
	for (var i=0; i < forms.length; i++) {
        
		var url = forms[i].getAttribute('action');
		var redirect = forms[i].getAttribute('dd_redirect');
		var x = forms[i].getAttribute('dd_submit');
        var target = forms[i];
        
        
        forms[i].addEventListener("submit", function(e) {
            
            e.preventDefault();
            console.log(url)
;            if (url == "" && x=='yes' || url == null && x=='yes') {
                console.log("DoDo301s: Your target url for one of your forms is empty");
            } else if (x=='yes') {

               var data = new FormData(target);
                dd_defaultSubmit({
                    url: url,
                    data: data,
                    target: target,
                    redirect_to: redirect
                });
            } else if (x=='file') {
                
                var data = new FormData(target);
                dd_defaultSubmit({
                    url: url,
                    data: data,
                    target: target,
                    redirect_to: redirect,
                    type: 'file'
                });
                
            } else if (x !='yes' && x !='' || x == '') {
                console.log("DoDo301s: dd_submit is not set to 'yes' for one of your forms");
            }
        });      
        
	}
     
}

function dd_defaultSubmit(get) {

	var self = {};
	// Start by getting the target
	// Sometimes, the target may already be query selected, so we have to check
	self.target = get.target;

    get.if_successful = function(e) {
        
        if (get.redirect_to !== null) {
            window.location.href = get.redirect_to;
        } else if (typeof e.dd_redirect !== "undefined") {
             window.location.href = e.dd_redirect;
        }
	}


	get.if_not = function(e) {
        
		var error_div = self.target.querySelector('[dd_feedback]');
        if (typeof e.dd_feedback === 'undefined') {
            var error = "Something went wrong while submitting this form";
        } else {
           var error = e.dd_feedback; 
        }
        
        
		// If feedback div exists, use it, else create one
		if (error_div) {

			error_div.innerHTML = error;
			dd(error_div).fadeIn(1000);

		} else {
			var error_div = document.createElement("div");
			error_div.setAttribute('dd_feedback',null);
			var text = document.createTextNode(error);
			error_div.appendChild(text);
			self.target.insertBefore(error_div, self.target.lastElementChild);
			dd(error_div).fadeIn(1000);

		}
	}
    
    get.content_type = "none";
	dd_ajax(get);
	
}


function dd_submit(get) {
    var self = {};
    self.target = dd(get.target).select() || '';
    self.type = get.type || 'normal';
    
    
    self.__construct = function() {
        self.target.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('form is submit');
            self.sendForm();
        });
    }
    
    self.sendForm = function() {
        self.prepareData();
        
        get.content_type = "none";
        dd_ajax(get);
    }
    
    self.prepareData = function() {
        var data = new FormData(self.target);
        get.data = data;
    }
    
    self.__construct();
}
