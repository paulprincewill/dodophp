<?php
    
    $d = '../../../../';
    $compiled_js = dd_compile(JS .'_dodo', 'scripts.dd', 'js');
    $compiled_css = dd_compile(UI .'_css/dodo', 'dodo.dd', 'css');



    for ($i=0; $i < count($projects); $i++) {
        
        $project = $projects[$i];
        $project = $d.$project;
        
        $dest = "$project/apps/frontend/_lib/dodo.js";
        copy(JS ."_dodo/$compiled_js" , $dest);
	

        $dest = "$project/ui/_css/dodo.css";
        copy(UI ."_css/dodo/$compiled_css", $dest);
        
        $dest = "$project/apps/backend/_lib/dd_compile.php";
        copy(BACKEND_LIB ."dd_compile2.php" , $dest);
	
        
        $dest = "$project/pages/ddcreate.php";
        copy( '../../../pages/ddcreate.php', $dest);

        $dest = "$project/initialize.php";
        copy('../../../initialize.php', $dest);

        
        

        copy_dir(UI.'ddcreate', "$project/ui/ddcreate");
        copy_dir(JS.'ddcreate', "$project/apps/frontend/ddcreate");
        copy_dir('../ddcreate', "$project/apps/backend/ddcreate");
        copy_dir('../../../_dodo', "$project/_dodo");
    }
	
    