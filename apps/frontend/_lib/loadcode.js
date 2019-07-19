function dd_initialize() {
    
    
}

function loadCode(page, target, language) {
    
    dd_ajax({
        url: "app/_lib/loadcode",
        data: "page="+page,
        ready: function(e) {
            e = String(e).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            dd(target+" .description").html("<pre><code class='language-"+language+"'>"+e+"</code></pre>");
            loadPrism();
        }
    })
}