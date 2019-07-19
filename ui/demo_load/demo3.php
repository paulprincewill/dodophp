<div id="demo3">
    
   <div class="description"> 
       You can also link a result to an attribute of an element, instead of using  <span class="code">dd_display='result_name'</span> use <span class="code"> dd_attr="result_name" </span> to specify you want to use it as an attribute, and then <span class="code"> attribute_name="[result_name]" </span> to apply it to any attribute 
    </div>
    
    <a  dd_load="app/demo_load/change_position" dd_target="#result3"> Try it </a>
    <h1 id="result3" align="[final_position]" dd_attr="final_position">
        Hello world
    </h1>
    
</div>