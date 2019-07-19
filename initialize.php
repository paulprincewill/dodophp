<?php

	// Loading session
	ob_start();
	session_start();

	$relative_path = '';
	$path = '../';
	$config = 'config.php';
	$headerIsLoaded = false;

	
	// This special setting is for subfolder linking
	if (!file_exists($path.$config)) {
		$path = "../../";
		if (!file_exists($path.$config)) {
			$path = "../../../";
			if (!file_exists($path.$config)) {
				$path = "../../../../"; 
			}
		}	
	}

	require($path.$config);

	// Define URLs
	define("UI", $path._UI);
	define("APP", $path.BACKEND);
	define("JS", $path.FRONTEND);
	define("DODO", $path."dodo/");
	define("ROOT", "../");
	define("PATH", $path);
	define("FRONTEND_LIB", $relative_path._FRONTEND_LIB);
	define("BACKEND_LIB", $path._BACKEND_LIB);

	// This will get the current link of this page
	if (!isset($page_link)) {
	  	$page_link = basename($_SERVER['REQUEST_URI']);
	  	$page_link = explode('?', $page_link);
	  	$page_link = $page_link[0];
	} else if ($page_link == 'index') {
	 	$page_link = $page_link;
	}

	function loadUI($link) {
		global $page_link;
		if (file_exists(UI.$page_link.'/'.$link.'.php')) {
			include UI.$page_link.'/'.$link.'.php';
		}
		else if (file_exists(UI.$link.'.php')) {
			include UI.$link.'.php';
		}
	}

    
    function loadPage($link, $type="internal") {
        global $page_link;
        if (file_exists(UI.$page_link.'/'.$link.'.php')) {
            $final_link = $page_link.'/'.$link.'.php';
		}
		else if (file_exists(UI.$link.'.php')) {
			$final_link = $link.'.php';
		}
        
        if ($type == "internal") {
            
            echo "<ddpage url='hash_$link' type='$type' style='display: none'>";
            include UI.$final_link;
            echo "</ddpage>";
        }
	
    }

    function loadTemplate($link) {
        global $page_link;
        if (file_exists(UI.$page_link.'/'.$link.'.php')) {
            $final_link = $page_link.'/'.$link.'.php';
		}
		else if (file_exists(UI.$link.'.php')) {
			$final_link = $link.'.php';
		}
        

        echo "<ddtemplate for='$link' style='display: none'>";
        include UI.$final_link;
        echo "</ddtemplate>";
        
	
    }

	// This guy checks if this page is requested using ajax
	// If it is, don't load the header, only the styles
	function loadHeader($link = 'main') {
		global $page_link; global $page_title; global $page_description; global $page_keywords;
        

		if (!isset($_SERVER['HTTP_DODO'])) {
            
            header_is_loaded();
			include UI ."headers/$link.php";
            
		} else {
			echo "<link rel='stylesheet' href='".UI."/$page_link/_styles.dd.css'>";
		}
	}

	// Same thing as loadHeader above
	function loadFooter($link = 'main') {
		global $path; global $page_link;

		echo "<script src='". FRONTEND_LIB."dodo.js'></script>";
		echo "<script src='". FRONTEND ."$page_link/_scripts.dd.js'></script>";

		if (!isset($_SERVER['HTTP_DODO'])) {
			// echo "<script src='".$path."apps/frontend/_plugins/dodo.js'></script>";
			include UI ."footers/$link.php";
		}
	}

    // Same thing as loadHeader above
	function loadScript($link) {
        
        global $page_link;
		if (file_exists(JS.$page_link.'/'.$link.'.js')) {
			echo "<script src='". FRONTEND ."$page_link/$link.js'></script>";
		}
		else if (file_exists(JS.$link.'.js')) {
            echo "<script src='". FRONTEND ."$link.js'></script>";
		}
	}

    function header_is_loaded() {
        global $page_link;
        include BACKEND_LIB.'dd_compile.php';
    }
