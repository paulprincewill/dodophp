function dd_setAjax() {
   document.addEventListener('click', function(e) {
            
            if (e.target && e.target.getAttribute('dd_ajax') !== null) {
                
                var ele = e.target;
                var url = ele.getAttribute('dd_ajax');

                dd_ajax({
                    url: url,
                    expecting: 'JSON',
                    ready: function(x) {
                        if (typeof x.dd_success !=='undefined') {
                             ele.setAttribute('dd_success',x.dd_success);
                        }

                        if (typeof x.dd_feedback !=='undefined') {
                            ele.innerHTML = x.dd_feedback;
                            dd(ele).fadeIn(500);
                        }
                    }
                })
            }

        }) 
}    

function dd_ajax(get) {

	var self = {};
	self.url = get.url;
	self.loader = '';
	self.ready = get.ready;
	self.data = get.data || '';
	self.method = get.method || 'POST';
    self.content_type = get.content_type || '';
    self.data_type = get.data_type || '';
    self.if_successful = get.if_successful || '';
    self.if_not = get.if_not || '';  
    self.expecting = get.expecting || self.if_successful !='' && 'JSON' || '';

	self.__construct = function() {
        self.start_loader();
        self.prepare_data();
		self.prepare_connection();

		if (self.method == 'GET') {self.request_using_get();} 
		else {self.request_using_post();}
        
		self.send_request();
	}
    
    self.start_loader = function() {
       
        var loader = dd('dd_loader [dd_ajaxload]');
        if (loader.select()) {
            self.loader = loader;
            loader.fadeIn(500);
        }
    }
    
    self.end_loader = function() {
        
        if (self.loader !='') {
            self.loader.fadeOut(500);
        }
    }
    
    self.prepare_data = function() {
        if (self.data_type == 'object' && self.content_type == '') {
            self.data = dd(self.data).urlEncode();
        }
    }
    
	self.prepare_connection = function() {
		self.ajax = window.XMLHttpRequest && new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
	}

	self.request_using_get = function() {
		self.ajax.open("GET",self.url+'?'+self.data,true);
       	self.ajax.send();
	}

	self.request_using_post = function() {
        
        console.log('url - '+self.url);
        console.log(self.data);

		self.ajax.open("POST",self.url,true);
        if (self.content_type != 'none' && self.content_type == '') {
            self.ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        } else if (self.content_type != 'none' &&  self.content_type != '' ) {
            self.ajax.setRequestHeader("Content-type", self.content_type);
        }
        
		self.ajax.send(self.data);
	}

	self.send_request = function() {
        
		self.ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
				self.ajax_has_worked(this.responseText);
                self.end_loader();
            }
        };
	}
    
    self.ajax_has_worked = function(e) {
        
        if (self.expecting == "JSON") {
            e = JSON.parse(e);
        }

        if (typeof self.if_successful === 'function' && typeof e.dd_success !== 'undefined' && e.dd_success) {
           self.if_successful(e);
        } 
        
        if (typeof self.if_not === 'function' && typeof e.dd_success !== 'undefined' && !e.dd_success) {
           self.if_not(e);
        }
        
        if (typeof self.ready === 'function') {
        	self.ready(e);
        }
        
        console.log('result - '+e);
    }
   

	self.__construct();
}
