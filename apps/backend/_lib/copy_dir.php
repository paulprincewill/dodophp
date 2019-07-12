<?php

    function copy_dir($src,$dst) {

			$dir = opendir($src); // Open directory
            if (!is_dir($dst)) {
                // Create folder if it does not exist
                mkdir($dst);
            }
        
			// Loop through everything in the directory
			while(false !== ( $file = readdir($dir)) ) {
			 	if (( $file != '.' ) && ( $file != '..' )) {
					 
					// If the item is a folder, then pass it through this function again
                    
                    
                        
					if ( is_dir($src . '/' . $file) ) {
                        
						 copy_dir($src . '/' . $file,$dst . '/' . $file);
                        
					} else {
						 copy($src . '/' . $file,$dst . '/' . $file);
					}
				}
			}
			closedir($dir);
		}