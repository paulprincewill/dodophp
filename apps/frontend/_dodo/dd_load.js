function dd_setLoad(x) {
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
    
    var dataFromLink = dat.getAttribute('dd_dataFromLink') !== null && dat.getAttribute('dd_dataFromLink') =='' && window.location.search.slice(1) || '';
    
    var method = dataFromLink !='' && 'GET' || 'POST'; 
    
    return {
            url: url,
            target: dat,
            data: dataFromLink,
            method: method,
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
        
        // We start of by cloning first element
        var elementTemplate = target.querySelector('[dd_cloned]');
        if (!elementTemplate) {
            dd(target.children[0]).clone(1);
            elementTemplate = target.querySelector('[dd_cloned]');

        } else {
            // Exclude clone when counting all elements
            allElements = allElements-1;
        }
        
        
        
        
        // Create new elements for extra data
        // If the data we need is greater than the available elements
        // Always create new element if we are appending
        if (self.append == 'yes' || self.amount > allElements) {
            
            if (self.append == 'yes') {
                var howMany = allElements == 1 && self.amount-1 || self.amount;
            } else if (self.amount > allElements) {
                var howMany = self.amount - allElements;
            }

        
            dd(elementTemplate).clone(howMany);      
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
