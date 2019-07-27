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
    
}