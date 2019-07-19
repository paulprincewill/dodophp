<div id="demo1">
    
    
    
   <div class="description"> 
       Using <span class="code">dd_load</span> attribute, you can display result from your backend to your frontend. It can dsiplay this result in any element, input or as src to images. You just need to use <span class="code">dd_display</span> to link the result to the element.
    </div>
    
    <div class="links">
        <a onclick="loadCode('ui/demo_load/try1.php','#demo1','html')">try1.php</a>
        <a onclick="loadCode('apps/backend/demo_load/user_details.php','#demo1','JSON')">user_details.php</a>
    </div>
    <?php include "try1.php" ?>
    
</div>