<?php
    
    require "../../../initialize.php";
    $content =  file_get_contents("../../../".$_POST['page']);
    echo $content;
    
    