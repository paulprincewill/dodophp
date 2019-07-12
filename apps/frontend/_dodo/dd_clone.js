function dd_setClone() {
     // This section activates dd_clone
    var ele = document.querySelectorAll("[dd_clone]");
    for (var i = 0; i < ele.length; i++) {
        var repeat = ele[i].getAttribute('dd_clone');
        ele[i].removeAttribute('dd_clone');
        for (var j = 1; j < repeat; j++) {
            var clone = ele[i].cloneNode(true); // Clone node has to be inside, not outside this loop
            ele[i].parentNode.insertBefore(clone, ele[i].nextSibling);
        }
    }
    
}