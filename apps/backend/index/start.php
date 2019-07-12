<?php

	include "../../../initialize.php";
	include "../_lib/copy_dir.php";
    include "../publish/dd_compile.php";


    if (isset($_POST["folder"])) {
		
		$folder = $_POST["folder"];
		$folder = str_replace(' ', '', $folder); // Replace space in the folder name

		if ($folder == "") {
            $msg['dd_success'] = false;
            $msg['dd_feedback'] = 'You did not type in anything. Why?';
		}

		else {

			$target = "../../../../".$folder; // Go as far back to the main root

			// Dont create folder if it already exists
			if(!is_dir($folder)){

				copy_dir("../../../_project", $target);
                
                $projects = [$folder];
                require "../publish/publish_dodo.php";

				$_SESSION["dd_project"] = $folder;
                $msg["dd_success"] = true;
                $msg["dd_redirect"] = $target;
			}

			else {
                $msg["dd_success"] = false;
				$msg["dd_feedback"] = "This folder already exists";
			}
		}
	}
    
    echo json_encode($msg);