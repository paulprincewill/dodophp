<?php


	include "../../../initialize.php";
	$data = [];

	if (isset($_POST["page_name"])) {
		
		$page = strtolower($_POST["page_name"]);

		if ($_POST["page_title"] != '') {
			$page_title = $_POST["page_title"];
		} else { $page_title = $page; }

		if ($_POST["page_description"] != '') {
			$page_description = $_POST["page_description"];
		} else { $page_description = $page; }

		if ($_POST["page_keywords"] != '') {
			$page_keywords = $_POST["page_keywords"];
		} else { $page_keywords = $page; }

		// First we create the folders
		if(is_dir(UI.$page) || is_dir(APP.$page)|| is_dir(JS.$page)) {

			$data['dd_success'] = false;
			$data['dd_feedback'] = "Folders associated with this page already exists";
		}

		else {
			$cp = new cp($page, $page_title, $page_description, $page_keywords);

			$cp->create_folders();
			$cp->create_mainPage();
			$cp->copy_templates();

			$data['dd_success'] = true;
			$data['dd_redirect'] = $page;
		}
	}


	echo json_encode($data);

	Class cp {

		public function __construct($page, $page_title, $page_description, $page_keywords) {
			$this->page = $page;
			$this->page_title = $page_title;
			$this->page_description = $page_description;
			$this->page_keywords = $page_keywords;
		}

		public function create_folders() {
			mkdir(UI.$this->page); 
			mkdir(APP.$this->page);
			mkdir(JS.$this->page); 
		}

		public function create_mainPage() {

			$page = file_get_contents("../../../pages/_template.txt");
			$fullpage = str_replace('$dpage_link', $this->page, $page);
			$fullpage = str_replace('$dpage_title', $this->page_title, $fullpage);
			$fullpage = str_replace('$dpage_description', $this->page_description, $fullpage);
			$fullpage = str_replace('$dpage_keywords', $this->page_keywords, $fullpage);

			$file = fopen('../../../pages/'.$this->page.".php", "w");
			fwrite($file,$fullpage);
			fclose($file);
		}

		public function copy_templates() {

			$this->copy_dir(UI.'_template', UI.$this->page);
			$this->copy_dir(JS.'_template', JS.$this->page);
			$this->copy_dir(APP.'_template', APP.$this->page);
		}


		// This function will create the project folder, then copy dodo files into it
		private function copy_dir($src,$dst) {

				$dir = opendir($src); // Open directory

			// Loop through everything in the directory
			while(false !== ( $file = readdir($dir)) ) {
			 	if (( $file != '.' ) && ( $file != '..' )) {
					 
					// If the item is a folder, then pass it through this function again
                    
                    if (!is_dir($dst)) {
                        // Create folder if it does not exist
                        mkdir($dst);
                    }
                        
					if ( is_dir($src . '/' . $file) ) {
                        
						 copy_dir($src . '/' . $file,$dst . '/' . $file);
                        
					} else {
						 copy($src . '/' . $file,$dst . '/' . $file);
					}
				}
			}
			closedir($dir);
		}
	}
?>