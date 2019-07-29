function dd_setClone() {
     // This section activates dd_clone
    var ele = document.querySelectorAll("[dd_clone]");
    for (var i = 0; i < ele.length; i++) {
        var repeat = parseInt(ele[i].getAttribute('dd_clone'));
        var target = ele[i].getAttribute('dd_template');
        ele[i].removeAttribute('dd_clone');
        
        if (target !== null) {
            target = document.querySelectorAll(target);
            target = target[target.length - 1];
            ele[i].addEventListener("click", function() {
                dd(target).clone(repeat);
            });
            
        } else {
            target = ele[i];
            dd(target).clone(repeat);

        } 
        
       

        
    }
    
}