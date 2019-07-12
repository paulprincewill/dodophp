
function dd_initialize() {
    
    dd_load({
        url: 'app/publish/folders',
        target: '#folders',
        amount: 'all',
        dd_pagination: 'no',
        on_load: function(data, target) {
            target = dd(target).select();
            target.addEventListener('click', function() {
                select_project(data.folder_name, target);
            })
        },
        after_load: function (data) {
            dd('.select_all').select().addEventListener('click', function() {
                select_all(data);
                console.log('event listerner activated');
            })
        }
    })
    
}


var selected = [];
function select_project(folder, target) {
    
    if (selected.includes(folder)) { // Remove if already selected
        selected = selected.filter(function(value) {
            if (value !=folder) { return value }
        });
        
        target.classList.remove('selected');
        
    } else {
        selected.push(folder);
        target.classList.add('selected');
    }
    
    
    dd('.total_selected').fadeIn(500);
    dd('.total_selected').html(selected.length); 
}

function select_all(folders) {
    
    var div = document.querySelectorAll("#folders > div");
    var i = 0;
    for (var x in folders) {
        
        if (folders.hasOwnProperty(x)) {
            select_project(folders[x].folder_name, div[i]);
            i++;
        }
    }
    
    
}

function publish() {
    if (selected.length < 1) {
        dd('#header > p').html("You have not selected any project");
        dd('#header > p').fadeIn(500);
    } else {
        
        var data = {};
        data.projects = selected;
        
        dd_ajax({
            url: 'app/publish/publish',
            data: data,
            data_type: 'object',
            if_successful: function() {
                var x = dd('.publish button');
                x.select().style.backgroundColor = "black";
                x.html('Published');
                x.fadeIn(500);
            }
        }) 
    }
   
}