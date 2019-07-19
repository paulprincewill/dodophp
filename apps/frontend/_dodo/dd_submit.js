function dd_setSubmit() {
    
    // This whole section is to get things ready for forms to be submitted automatically
	var forms = document.querySelectorAll("form[dd_submit]");
	for (var i=0; i < forms.length; i++) {
        
		var url = forms[i].getAttribute('action');
		var redirect = forms[i].getAttribute('dd_redirect');
		var bindData = forms[i].getAttribute('dd_bindData');
		var bindResult = forms[i].getAttribute('dd_bindResult');
		var x = forms[i].getAttribute('dd_submit');
        var target = forms[i];


        var data = new FormData(target);

        dd_submit({
            url: url,
            data: data,
            target: target,
            redirect_to: redirect,
            type: x,
            if_successful : function(e) {

                if (redirect !== null) {
                    window.location.href = redirect;
                } else if (typeof e.dd_redirect !== "undefined") {
                     window.location.href = e.dd_redirect;
                }
},

            if_not : function(e) {

                var error_div = target.querySelector('[dd_feedback]');
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
                    target.insertBefore(error_div, target.lastElementChild);
                    dd(error_div).fadeIn(1000);

                }
},
            content_type: "none",
            bindData: bindData,
            bindResult: bindResult

        });    
        
	}
     
}


function dd_submit(get) {
    
    var self = {};
    self.target = dd(get.target).select() || '';
    self.type = get.type || 'normal';
    self.dataTarget = get.bindData || '';
    self.resultTarget = get.bindResult || '';
    self.data = '';
    
    
    self.__construct = function() {
        self.target.addEventListener('submit', function(e) {
            e.preventDefault();
            self.sendForm();
            
            if (self.dataTarget !='' && self.dataTarget !==null) {
                self.bindData();
            }
            
        });
    }
    
    self.sendForm = function() {
        self.prepareData();
        
        get.content_type = "none";
        
        if (self.resultTarget !='' && self.resultTarget !==null) {
            get.after_request = function(e) {

                var target = dd(self.resultTarget).select();
                target = dd_bindLoad(target);
                target.result = e;
                dd_load(target)
            }
        }
        
        dd_ajax(get);
        
    }
    
    self.prepareData = function() {
        var data = new FormData(self.target);
        self.data = data;
        get.data = data;
    }
    
    self.bindData = function() {
        var allData = {};
        for (var data of self.data.entries()) {
            var key = data[0], value = data[1];
            allData[key] = value;
            
        }
        
        allData = [allData];
        var target = dd(self.dataTarget).select();
        var xx = dd_bindLoad(target);
        xx.url = 'undefined';
        xx.result = allData;
        dd_load(xx);
        
    }
    
    self.__construct();
}
