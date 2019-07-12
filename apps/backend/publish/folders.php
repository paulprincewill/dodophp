<?php
	include "../../../initialize.php";

    $folders = [];

    $dir = opendir('../../../../'); // Open directory
    @mkdir($dst);

    // Loop through everything in the directory
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            
            if (file_exists("../../../../$file/initialize.php")) {
                
                $folder['folder_name'] = $file;
                array_push($folders, $folder);
            }
        }
        
    }

    closedir($dir);

    echo json_encode($folders);

?>
