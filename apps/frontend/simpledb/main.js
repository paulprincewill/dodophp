function addField(type, exist) {
    
    // First, we save current field
    if (!saveField()) { // If save was cancelled, don't run
        return;
    }
    
    // Then, we create a new form
    // it used to be a div, but am too lazy to edit variable
    var div = document.createElement("form");
    div.setAttribute('field_type',type);
    
    // Then we copy contents from the template depending on its type - input|select|checkbox
    var template = dd_template("template_input").copy();
    div.innerHTML = template;
    
    // Then we hide the current field
    // '.current_field' class is what identifies the current field
    
        
    hideField();
    div.classList.add("current_field");
    dd("#main_area").select().appendChild(div);

    showCurrentField();

    
}

function showCurrentField() {
    
    dd("#main_area .current_field").fadeIn(500); 
}

function hideField(field) {
    
    var x = dd("#main_area .current_field");
    x.select().style.display = "none";
    
    var x = dd("#main_area .current_field");
    // Delete if this is a discarded field
    if (x.select().getAttribute("field_type") != 'null' && x.select().getAttribute("field_type") == 'discarded') {
        dd("#main_area").select().removeChild(x.select());
    } else {
        x.select().classList.remove("current_field");
    }

}

function createList(keyword)  {

    var div = document.createElement("div");
    div.classList.add(keyword);
    
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(keyword));
    p.addEventListener('click', function() {
        showField(keyword);
    })
    
    div.appendChild(p);
    
    var span = document.createElement("span");
    span.appendChild(document.createTextNode("x"));
    
    span.addEventListener("click", function() {
        removeField(keyword);
    });

    div.appendChild(span);
    dd("#fields").select().appendChild(div);
    
    dd("#fields div:last-child").fadeIn(1000);
}
function updateList(where, what) {
    
    
    var x =  dd("#fields ."+where).select();
    if (x) {
        
        if (what == where) {
            return;
        }
        
        dd("#fields ."+where+" p").html(what);
        dd("#fields ."+where).fadeIn(1000);
        
        x.classList.add(what);
        x.classList.remove(where);
        
    } else {
        createList(what);
    }
}

function saveField() {
    
    var x = dd(".current_field").select();
    var field_keyword = dd("#main_area .current_field [name='keyword']").val();
    if (field_keyword == "") {
       if (confirm("You did not type in a keyword, discard this field?")) {
            x.setAttribute("field_type","discarded");
       } else {
           return false;
       }
       
    }
    
    // we also have to check if this has been saved before
    var field_name = x.getAttribute('field_name');
    if ( field_name === null) {
        x.setAttribute("field_name",field_keyword);
        createList(field_keyword);
    } else {
        updateList(field_name, field_keyword);
        x.setAttribute("field_name",field_keyword)
    }
    return true;

}

function showField(name) {
    
    saveField();
    hideField();
    
    var x = dd("#main_area [field_name='"+name+"']");
    x.select().classList.add("current_field");
    
    showCurrentField();
}

function removeField(field) {
    
    if (!confirm("Remove field for '"+field+"' ?")) {
        return;
    }
    
    var x = dd("#fields ."+field);
    x.fadeOut(1000);
    dd("#fields").select().removeChild(x.select());
    
    dd("#main_area").select().removeChild(dd("#main_area [field_name='"+field+"']").select());
    
}


// This is where the real party begins
function done() {
    
    saveField();
    submitAllFields();
}

function submitAllFields() {
    
    var all_fields = [];
    dd("#main_area form").selectAll(function(f) {
        var form = new FormData(f);
        var data = {};
        form.forEach(function(value, key) {
            data[key] = value;       
        });
                     
        all_fields.push(data);
    });
    
    
    var data = "preview=yes&fields="+JSON.stringify(all_fields);
    dd_ajax({
        url: "app/simpledb/create_registration",
        data: data,
        expecting: "JSON",
        if_successful: function(e) {
            createPreview(all_fields, e.html);
        },
        if_not: function(e) {
            console.log(e);
        }
    })
}

function createPreview(data, html) {
    
    dd("#preview").fadeIn(500);
    
    var html = JSON.parse(html);
    dd("#preview > .form_preview").html(html);
    
    var fields = document.querySelectorAll("#preview > .form_preview > *");
    for (var i = 0; i<fields.length; i++) {
        
        fields[i].innerHTML += '<data class="keyword">'+data[i].keyword+'</data><div align="right" class="data_right"><data class="min">min: '+data[i].minimum+'</data><data class="max"> max: '+data[i].maximum+'</data></div>';
        
        if (data[i].placeholder == '' && fields[i].querySelector('input')) {
            fields[i].querySelector('input').placeholder = "xxx"
        }
        
        if (fields[i].querySelector('label') && data[i].required == 'on') {
            fields[i].querySelector('label').innerHTML += '<data class="required">*</data>';
        }
    }
    
}


function continueEditing() {
    dd("#preview").fadeOut(500);
}

function publish() {
    dd("#done").fadeIn(500);
}
