<?php
    
	include "../../../initialize.php";
	include "dd_compile.php";
	include "../_lib/copy_dir.php";
    
    $projects = $_POST['projects'];
    include "publish_dodo.php";

    $msg['dd_success'] = true;
    echo json_encode($msg);