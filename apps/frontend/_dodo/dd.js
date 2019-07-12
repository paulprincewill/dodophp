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
        console.log(selector);
        console.log(typeof selector);
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
