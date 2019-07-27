function dd(selector) {
	var self = {};

	self.validQuery = function() {
		try {
			document.querySelector(selector) ;
			return true;
		} catch(e) {}
		return false;
	}
    
    self.validObject = function() {
        if (typeof selector !== 'object' ) {
            console.log("The target is not an object");
            return false;
        } else {
            return true;
        }
    }
    
	self.target = self.validQuery() && document.querySelector(selector) || self.validObject() && selector || false;

     
	self.select = function() {
		return self.target;
	}

	self.selectAll = function(callback) {
		var all = document.querySelectorAll(selector);
		
		if (typeof callback === 'function') {
			for (i=0; i < all.length; i++) {
				callback(all[i]);
			}
		}

		return all;
	}

	self.alert = function() {
		alert(selector);
	}

	self.html = function(value) {
		if (typeof value === 'undefined') {
			return self.target.innerHTML;
		} else {
			self.target.innerHTML = value;
		}
	}

	self.val = function(value) {
		if (typeof value === 'undefined') {
			return self.target.value;
		} else {
			self.target.value= value;
		}
	}

	self.style = function(property, value) {
		self.target.style[property] = value;
	}

	self.fadeIn = function(time, callback) {

        self.hide();
		self.target.style.opacity = 0;
		self.show();

		var opacity = 0;
		var increment = 10/time;
		function changeOpacity() {
			self.target.style.opacity = opacity;
			if (opacity >= 1) {
				clearInterval(timer);
				self.target.style.opacity = 1;
                
                if (typeof callback === 'function') { 
                    callback();
                }
                
			} else {
				opacity = opacity+increment;
			}
		}

		var timer = setInterval(changeOpacity, 10);
	}

	self.fadeOut = function(time, callback) {

		self.target.style.opacity = 1;

		var opacity = 1;
		var increment = 10/time;
		function changeOpacity() {
			self.target.style.opacity = opacity;
			if (opacity <= 0) {
				clearInterval(timer);
				self.target.style.opacity = 0;
				self.hide();
                
                if (typeof callback === 'function') { 
                    callback();
                }
                
			} else {
				opacity = opacity-increment;
			}
		}

		var timer = setInterval(changeOpacity, 10);
	}

	self.show = function() {
		var previousDisplay = self.target.getAttribute('dd_previousDisplay');
		if (previousDisplay ===null || previousDisplay =='') {
            // First, we get the initial value of propery 'display'
	       	previousDisplay = self['target'].style.display !='' && self['target'].style.display !='undefined' && self['target'].style.display !='none' && self['target'].style.display || getComputedStyle(self.target).display !='none' && getComputedStyle(self.target).display || 'block';
            
		}
        
        self.target.style.display = previousDisplay;
	}

	self.hide = function() {
        
		// First, we get the initial value of propery 'display'
		var previousDisplay = self['target'].style.display !='' && self['target'].style.display !='undefined' && self['target'].style.display || getComputedStyle(self.target).display || 'block';

		// Then we save it in an attribute of 'data-dd-previous_display'
		if (previousDisplay !='' && previousDisplay !='none') {
			self.target.setAttribute('dd_previousDisplay',previousDisplay);
		}
        
        self['target'].style.display = 'none';
	}

	self.isEmpty = function() {
		for (var key in selector) {
			if(selector.hasOwnProperty(key)) {
				return false;
			}
		}

		return true;
	}
    
    self.urlEncode = function() {
        
        if (!self.validObject()) {
            return false
        }
        
        var obj = self.target;
        
        // This code is meant to break down multidimentional objects
        for (var x in obj) {
          if (obj.hasOwnProperty(x)) { 
            if (typeof obj[x] === 'object') { 
                var k = obj[x];
                for (var y in k) {
                    if (k.hasOwnProperty(y)) { 
                        obj[x+"["+y+"]"] = k[y];
                    }
                }
                
                delete obj[x];
            }
          }
        }
        
        
        var x  = Object.keys(obj).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
        }).join('&');
        return x;
        
    }
    
	return self;
}
function dd_setAjax() {
   document.addEventListener('click', function(e) {
            
            if (e.target && e.target.getAttribute('dd_ajax') !== null) {
                
                var ele = e.target;
                var url = ele.getAttribute('dd_ajax');
                var target = ele.getAttribute('dd_target');
                if (target !==null && target !='') {
                    ele = dd(target).select();
                }

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
	self.after_request = get.after_request;
	self.data = get.data || '';
	self.method = get.method || 'POST';
    self.content_type = get.content_type || '';
    self.request_type = get.request_type || '';
    self.data_type = get.data_type || '';
    self.if_successful = get.if_successful || '';
    self.if_not = get.if_not || '';  
    self.expecting = get.expecting || self.if_successful !='' && 'JSON' || ''; 
	self.interval = get.interval || "";
	self.timeSet = get.timeSet || "";

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
        
        if (typeof self.after_request === 'function') {
        	self.after_request(e);
        }
        
        
        
        console.log(e);
    }
   

	self.__construct();
    
    if (self.interval !='' && self.timeSet !='yes') {
        if (typeof self.interval === 'number') {
            
            setInterval(function() {
                get.timeSet = 'yes';
                dd_ajax(get);
            }, self.interval)
        } else {
            console.log("DoDo301: interval was not set to a number");
        }
    }
}
function dd_setClone() {
     // This section activates dd_clone
    var ele = document.querySelectorAll("[dd_clone]");
    for (var i = 0; i < ele.length; i++) {
        var repeat = ele[i].getAttribute('dd_clone');
        var target = ele[i].getAttribute('dd_template');
        ele[i].removeAttribute('dd_clone');
        
        if (target !== null) {
            target = dd(target).select();
            ele[i].addEventListener("click", clone);
        } else {
            target = ele[i];
            clone();
        } 
        
        function clone() {
            
            var current_cycle = target.getAttribute("dd_cloneCycle") !== null && parseInt(target.getAttribute("dd_cloneCycle"))+1 || 0;
            target.setAttribute("dd_cloneCycle", current_cycle);
            
            for (var j = 1; j <= repeat; j++) {
                var clone = target.cloneNode(true); // Clone node has to be inside, not outside this loop
                clone.innerHTML = clone.innerHTML.replace("$id", j+(current_cycle*repeat));
                dd(clone).show();
                clone.removeAttribute('dd_cloneCycle');

                target.parentNode.insertBefore(clone, target);
                
            } 
            
            dd(target).hide();
        }
        

        
    }
    
}function dd_setLoad(x) {
    var data = document.querySelectorAll("[dd_load]");
	for (var i=0; i < data.length; i++) {
        (function() {
             var x = dd_bindLoad(data[i]);

            var target = data[i].getAttribute('dd_target') !== null && data[i].getAttribute('dd_target') !='' && data[i].getAttribute('dd_target') || '';

            if (target !='') {

                var y = data[i];
                data[i].addEventListener('click', function() {
                                    console.log(y);

                    var x = dd_bindLoad(y);
                    x.target = target;
                    console.log("clciked x is");
                    console.log(x);
                    dd_load(x);
                })

            } else {
               dd_load(x); 
            }
        }());
       
        
    }
}

function dd_bindLoad(dat) {
    var url = dat.getAttribute('dd_load');
        
    var amount = dat.getAttribute('dd_amount') !== null && dat.getAttribute('dd_amount') !='' && dat.getAttribute('dd_amount') || '';
    

    var append = dat.getAttribute('dd_append') !== null && dat.getAttribute('dd_append') !='' && dat.getAttribute('dd_append') || '';

    var pagination = dat.getAttribute('dd_pagination') !== null && dat.getAttribute('dd_pagination') !='' && dat.getAttribute('dd_pagination') || '';
    
    if (pagination == '') {
        pagination = amount == '' && 'no' || 'yes';
    }
    
    
    var interval = dat.getAttribute('dd_interval') !== null && dat.getAttribute('dd_interval') !='' && parseInt(dat.getAttribute('dd_interval')) || '';
    
    
    return {
            url: url,
            target: dat,
            amount: amount,
            pagination: pagination,
            append: append,
            interval: interval
        }
}

function dd_load(get) {
    
	var self = {};
	self.get = get; // The request comes as object, for flexibility
    self.result = get.result || '';
	self.data = get.data || "";
	self.page = get.page || 1;
	self.current_button = get.current_button || 'next';
	self.stored_data = "";
	self.storage_name = "";
	self.load = get.load || "";
	self.custom_convert = get.convert_result || "";
	self.preloading = get.preloading || "";
	self.storage = get.preloading || "off";
	self.url = get.url || self.load =="" && console.log('Dodo201: url is not set') || "";
	self.pagination = get.pagination || "no";
	self.amount = get.amount || "";
	self.append = get.append || "";
	self.ready = get.ready || function() {};
	self.on_load = get.on_load || function() {};
	self.after_load = get.after_load || function() {};
	self.display = get.display || "";
	self.target = get.target || self.display !='' && console.log('Dodo202: target is not set') || "";
	self.nodata = get.nodata || "There is no data to display";
	self.scroll = get.scroll || "yes";

	self.__construct = function() {

		self.prepareParameters();  // Prepare parameters that will be sent to backend

		// If data was already specified, don't send ajax
		if (self.result != '') {
			self.dataIsReady();
		}

		// If data is already stored, don't send ajax
		else if (self.storage != 'off') {

			if (self.thereIsStoredData()) {
				self.loadStoredData();
				self.dataIsReady();
			} else {
				self.sendRequest(); // If no stored data is available
			}
		} 

		else { 
			self.sendRequest();
		}
	}

	self.dataIsReady = function() {

        // This decide how to display
        self.convertResult();
		if (self.result !='' || !dd(self.result).isEmpty()) {
        
			self.ready(self.result);  // Callback function as soon as data is available

            if (self.amount != '') {
                
                self.displayMultipleData();
                
            } else {
                
                self.result = typeof self.result[0] !=='undefined' && self.result[0] || self.result;

                self.displaySingleData();
            }
            
            self.thereIsData();
            self.after_load(self.result);
		} 
        
        else {
			self.thereIsNoData();
		}

		// Save data by default
		if (self.storage != 'off') {	
			self.storeData();
		}
       
        if (self.pagination == 'yes') {
            self.displayPagination();
        }
        
	}

	self.prepareParameters = function() {
        
        pagination = dd(self.target).select().querySelector('[dd_pagination]');
        if (pagination) {
            
            if (self.current_button == 'next') {
               self.page = pagination.querySelector('[dd_next][dd_page]').getAttribute('dd_page');
                self.page = parseInt(self.page);
                
            } else if (self.current_button == 'previous') {
               self.page = pagination.querySelector('[dd_previous][dd_page]').getAttribute('dd_page'); 
                self.page = parseInt(self.page);
            }    

        }
        
        
        if (typeof self.page !=='number' ) {
            self.page = 1; 
        }
        
		var page = "dd_page="+self.page; 
        if (self.data != '') {
           get.data = self.data+"&"+page; 
        } else {
            get.data = page;
        }
		
	}

	self.convertResult = function() {
		if (self.custom_convert != '') {
			self.result = self.custom_convert(self.result);
			if (self.result == '' || typeof self.result === 'undefined') {
				console.log("DoDo301: You did not return any data in your customConvert function");
			}
		}

		if (typeof self.result !== "object") {
			self.result = JSON.parse(self.result);
		}
	}

	self.sendRequest = function() {
		get.ready = function(result) {
            
			self.result = result;
			self.dataIsReady();
		}

		dd_ajax(get);
	}

	self.loadStoredData = function() {
		console.log("Stored data has been loaded");
	}

	self.thereIsStoredData = function() {
		self.getStoredData();
		if (typeof self.stored_data !== 'undefined' || self.stored_data !='') {
			return true; } else {return false;}
	}

	self.getStoredData = function() {

		self.storage_name = self.url+'?'+self.result;

		if (typeof Storage !=='undefined') {
			if (self.storage == 'permanent') {
				self.stored_data = localStorage['dd_data']  || '';
			} else {
				self.stored_data = sessionStorage['dd_data'] || '';
			}

		} else { 
			self.stored_data = window.dd_data || '';
		}
	}

	self.storeData = function() {

		var previous_data = '';
		if (typeof Storage !== 'undefined' && this.storage !='off') {

			if (self.storage == 'permanent') {
				localStorage['dd_data'][self.storage_name] = self.result;
			} else {
				sessionStorage['dd_data'][self.storage_name] =  self.result;
				console.log('data has been stored');
			}
			
		} else {
			window.dd_data[self.storage_name] = self.result; // save in global variable if storage is unavailable
		}
	}

	self.displaySingleData = function() {		
		dd(self.target).hide(); // First we hide the div to create a smooth fadeIn.
		self.displayEachData(self.result, self.target);
		dd(self.target).fadeIn(500);
	}

	self.displayMultipleData = function() {
        
        // self.amount becomes result length on these conditions
        if (self.amount == 'all' || self.amount > self.result['length']) {self.amount = self.result['length'];}
        
        var target = dd(self.target).select();
		var allElements = target.childElementCount;
        
        // Exclude pagination when counting all elements
        if (target.querySelector('[dd_pagination]')) {
            allElements = allElements-1;
        }
        
        // Exclude nodata when counting all elements
        if (target.querySelector('[dd_nodata]')) {
            allElements = allElements-1;
        }
        
        if (allElements == 0) {
            console.log("DoDo203: Could not find any element inside '"+self.target+"' or '"+self.target+"' does not exist");
            return false;
        }
        
        // Create new elements for extra data
        // If the data we need is greater than the available elements
        // Always create new element if we are appending
        if (self.append == 'yes') {
            
            var howMany = allElements == 1 && self.amount-1 || self.amount;
            for (var i= 0; i<howMany; i++) {
                
                var newElement = target.children[0].cloneNode(true);
                target.children[allElements-1].parentNode.insertBefore(newElement, target.children[allElements-1].nextSibling);
            }
            
            // Since target now has new children, we have to re select it
            target = dd(self.target).select();
            
        } else if (self.amount > allElements) {
            
            for (var i= 0; i<self.amount - allElements; i++) {
                
                var newElement = target.children[0].cloneNode(true);
                target.children[allElements-1].parentNode.insertBefore(newElement, target.children[allElements-1].nextSibling);
            }
            
            // Since target now has new children, we have to re select it
            target = dd(self.target).select();

        }

        if (self.append != 'yes') {
          
            // Hide all extra elements if data is less than expected
            if (allElements > self.amount) {
                for (var i=self.amount; i < allElements; i++) {
                    var x = target.children[i];
                    dd(x).hide();
                }
            }   
        }
        
        
        if (allElements == 1) {
           allElements = 0; 
        } 
            
		for (var i=0; i<self.amount; i++) {
            
            var t = self.append == 'yes' && (allElements+i) || i;
			var x = target.children[t];
            
			if (typeof self.result[i] !== 'undefined' && !dd(self.result[i]).isEmpty()) {
               
				self.displayEachData(self.result[i], x);
				dd(x).fadeIn(500);
			} else {
                dd(x).hide();
            }
		}
        
//        if (self.append == 'yes') {
//            
//            var t = (allElements+1)-self.amount;
//			var x = target.children[t];
//            target.lastElementChild.scrollIntoView(true);
//        } else {
//            target.scrollIntoView(true);
//        }
//        
       
	}

	self.displayEachData = function(data, target) {

        self.on_load(data, target);
        for (var x in data) {
            if (data.hasOwnProperty(x)) {
                var where = dd(target).select();
                
                // We first check if target itself has dd_display
                if (where.getAttribute('dd_display') !== null) {
                        insertData(where);
                } else {
                    
                    var w = where.querySelectorAll("[dd_display='"+x+"']");
                    if (!dd(w).isEmpty()) {
                        for (var i = 0; i<w.length; i++) {
                            insertData(w[i]);

                        }
                    }
                }
                
                function insertData(w) {
                    var tag = w.tagName.toLowerCase()
                    if ( tag == 'img') {
                        w.src = data[x]; 
                    } else if (tag == 'input' || tag =='textarea') {
                        w.value = data[x]; 
                    } else {
                        w.innerHTML = data[x]; 
                    }
                }
                
                // We also check if there are attributes with this value
                var attr = where.querySelectorAll("[dd_attr]");
                if (!dd(attr).isEmpty()) {
                    
                    for (var i = 0; i<attr.length; i++) {
                        checkAttr(attr[i]);
                    }
                }
                
                if (where.getAttribute('dd_attr') !== null) {
                    checkAttr(where);
                }
                
                function checkAttr(attr) {
                    var ele = attr.attributes;
                    for (var j = 0; j < ele.length; j++) {
                        if (ele[j].value == "["+x+"]") {
                            ele[j].value = data[x];
                        }
                    }
                }
                
                // We also try to find if there is any dd_checkFor present
                var conditions = where.querySelectorAll("[dd_checkFor]");
                if (!dd(conditions).isEmpty()) {
                    
                    for (var i = 0; i<conditions.length; i++) {
                        checkFor(conditions[i]);
                    }
                } 
                
                if (where.getAttribute('dd_checkFor') !== null) {
                    checkFor(where);
                }
                
                function checkFor(condition) {
                    
                    var q = condition;
                    var dat = q.getAttribute('dd_checkFor');
                    var dd_if = q.getAttribute("dd_if");
                    

                    if (dat == x) {

                       if (dd_if !== null && dd_if == data[x]) {
                                dd(q).show();
                        } else {
                            dd(q).hide();
                        } 
                    }

                }
            }
        }
	}

	self.displayPagination = function() {
        
        var target = dd(self.target).select();
        var pagination = target.querySelector('[dd_pagination]');

        function createButton(x) {
            var button = document.createElement("button");
            button.setAttribute('dd_'+x,'');
            pagination.appendChild(button);
        }
        
        
        // First, we have to check if pagination element even exists
        if (!pagination) {
            pagination = document.createElement("p");
            pagination.setAttribute('dd_pagination','');
            target.appendChild(pagination);
            
            pagination = dd(self.target).select().querySelector('[dd_pagination]');
            createButton('previous');
            createButton('next');
            
        
            
        } else {
            
            if (!pagination.querySelector('[dd_next]')) {
                createButton('next');
            } 
            
            if (!target.querySelector('[dd_previous]')) {
                createButton('previous');
            } 
            
        }
        
        // We have to reselect it again since new elements were created
        pagination = dd(self.target).select().querySelector('[dd_pagination]');
        
        var next = pagination.querySelector('[dd_next]');
        var prev = pagination.querySelector('[dd_previous]');
        
        var next_num = self.page+self.amount;
        var prev_num = self.page-self.amount;
        
        if (prev_num < 1) {
            prev_num = 1;
        }
        
        next.setAttribute('dd_page', next_num);
        prev.setAttribute('dd_page', prev_num);
        
        self.get.ready = self.ready;
        self.get.data = self.data;
        
        if (self.get.next_button != 'yes') {
            
            self.get.next_button = 'yes';
            next.addEventListener('click', function() {
                
                self.get.current_button = 'next';
                self.get.page = next_num;
                dd_load(self.get);
            });
            
            
        }
        
        if (self.get.prev_button != 'yes') {
            
            self.get.prev_button = 'yes';        

            prev.addEventListener('click', function() {
                    
                self.get.current_button = 'previous';
                self.get.page = prev_num;
                dd_load(self.get);
            })
            
        }
        
	}

	self.thereIsNoData = function() {

        
        function hideEverything() {
            // Hide everything inside the target, except pagination
            var ele = dd(self.target).select();
            for(var i =0; i<ele.childElementCount; i++) {
                
                if (ele.children[i].getAttribute('dd_pagination') === null) {
                    dd(ele.children[i]).hide();  
                } 
            }
            
            // Hide next button
            ele = dd(self.target).select().querySelector('[dd_pagination] [dd_next]');
            if (ele) {
                dd(ele).hide();
            }
        }
        	


		var nodata_div = dd(self.target).select().querySelector("[dd_nodata]");
		if (nodata_div) {
            
            hideEverything();
			dd(nodata_div).fadeIn(500);
            
		} else if (self.nodata !='none') { // If we can't find any element with 'dd_nodata' create one
            
            hideEverything();
            
			var nodata = document.createElement("p");
			nodata.setAttribute("dd_nodata","");
			var text = document.createTextNode(self.nodata);
			nodata.appendChild(text);
            
            var pagination = dd(self.target).select().querySelector('[dd_pagination]');
            if (pagination) {
                pagination.parentNode.insertBefore(nodata, pagination);
            } else {
                dd(self.target).select().appendChild(nodata);
            }
            
			
			nodata = dd(self.target).select().querySelector("[dd_nodata]");
            dd(nodata).fadeIn(500);
		}

	
	}
    
    	// This one counters the effect of thereIsNoData()
	self.thereIsData = function() {
		
        var ele = dd(self.target).select().querySelector("[dd_nodata]");
        if (ele) {
            dd(ele).hide();
        }
        
        // Show next button
        ele = dd(self.target).select().querySelector('[dd_pagination] [dd_next]');
        if (ele) {
            dd(ele).show();
        }
        

		// take user to the top of the data list
		if (typeof self.scroll =='yes') {
			dd(get.target).select().scrollIntoView();
		}
	}
	self.__construct();
}
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
}function dd_checkForHashPage(callback) {
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

}function dd_init() {
   
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


