<?php

	/* Here is all you need to know 
		- This code will create the php, html and js file required for registration
		- The incoming data is in two layers - each field is seperated by - field - and each details in each field is seperated by - comma -
	*/
    include "../../../initialize.php";
	include "data.php";
	// include "replace.php";


	if (isset($_POST["fields"])) {
        
        $allfields = json_decode($_POST["fields"], true);
       
		$code = new startTheParty($allfields);
        $result['dd_success'] = true;
        $result['dd_feedback'] = "None";
        $result['html'] = json_encode($code->fullhtml);
        
        echo json_encode($result);
        
       
        
//		$start->prepareDetails();
//		$start->prepareFullCode();
//		$start->rewriteFiles();
	}

	class startTheParty {

		protected $allfields;
		protected $hidelabels;
		protected $html;
		protected $sql1;
		protected $sql2;
		protected $unique_user;
		protected $all_checks;

		public $fullhtml;
		protected $fulljs = 'register';
		protected $fullphp;

		protected $label;
		protected $placeholder;
		protected $keyword;
		protected $type;
		protected $minimum;
		protected $maximum;
		protected $required;
		protected $default;
		protected $formtype;

		protected $i;


		public function __construct($allfields) {
			$this->allfields = $allfields;
            $this->prepareDetails();
		}

		public function replace($target, $variables) {
			$variables = explode(',',$variables);
			for ($i=0; $i<count($variables); $i++) {

				$variable = $variables[$i];

				$this->$target = str_replace('$'.$variable, $this->$variable, $this->$target);
			}
		}

		public function prepareDetails() {
           
			// Loop through all fields, get all details and create codes for the details
			for ($i=0; $i<count($this->allfields); $i++) {
     
				$field = $this->allfields[$i];
				$this->label = $field['label'];
				$this->placeholder = $field['placeholder'];
				$this->keyword = $field['keyword']; $this->keyword = strtolower($this->keyword);
				$this->type = $field['type']; $this->type = strtolower($this->type);
				$this->minimum = $field['minimum'];
				$this->maximum = $field['maximum'];
				
                if (isset($field['required']) && $field['required'] == "on") {
                   $this->required = "required"; 
                }
                
				$this->default = $field['default'];
				$this->formtype = $this->type; 

				$this->i = $i;
                
				$this->prepareHtml();
//				$this->prepareChecks();
//				$this->prepareSql();
//				$this->prepareJs();

				// Get the unique keyword for user
			 	// it's always the first field
				if ($i == 1) {
					$this->unique_user = $this->keyword;
				}
			}
		}

		public function prepareChecks() {

			$checks = "if_empty";
			$set_minimum = "";
			$set_maximum = "";

			// Default form type is 'text'
			if ($this->type == "alphabelt" || $this->type=="any" || $this->type=="alphanumeric") {
				$this->formtype = "text";
			}

			// Create check for type
			if ($this->type != "any" && $this->type !="date" && $this->type != "password") {
				$checks = $checks.","."if_".$this->type;
			}

			// Create check for minimum
			if ($this->minimum !="") {
				$set_minimum = '$dt->minimum='.$this->minimum.';';
				$checks =$checks.",if_minimum";
			}

			// Create check for maximum
			if ($this->maximum !="") {
				$set_maximum = '$dt->maximum='.$this->maximum.'; ';
				$checks =$checks.",if_maximum";
			}

			// Create check for comparing password
			if ($this->keyword == "second_password") {
				$set_maximum = '$dt->compare=$password; ';
				$checks =$checks.",compare";
			}

			// Don't create checks if we are not checking for anything important 
			if ($checks !=="if_empty" || $this->required == "on") {
				$checks = '$dt->check("'.$checks.'");';

				if ($this->required != "on") {
					$if_statement = 'if ($dt->data !=="") {';
					$close_bracket = '}';
					$checks = $if_statement."\r\n\t\t\t".$checks."\r\n\t\t".$close_bracket;
				}
			}

			// Prepare backend checks
			$check = file_get_contents("defaults/checks.php");
			$check = str_replace('$keyword', $this->keyword, $check);
			$check = str_replace('$set_maximum', $set_maximum, $check);
			$check = str_replace('$set_minimum', $set_minimum, $check);
			$check = str_replace('$checks', $checks, $check);

			$this->all_checks = $this->all_checks.$check;
		}

		public function prepareSql() {
			$php = '$';
			if ($this->keyword != "second_password") {

				if ($this->i == 1) {
					$this->sql1 = $this->sql1."$this->keyword";
					$this->sql2 = $this->sql2."'$php$this->keyword'";

				} else { //  Don't add comma to the last value
					$this->sql1 = $this->sql1.",$this->keyword";
					$this->sql2 = $this->sql2.",'$php$this->keyword'";
				}
			}
		}

		public function prepareHtml() {
			
			// Prepare the HTML
            $this->html = file_get_contents("defaults/form.php");
			$this->replace("html", "label,formtype,keyword,placeholder,maximum,default,required");
			$this->fullhtml = $this->fullhtml.$this->html;
		}
			
		public function prepareJs() {
			$this->fulljs = $this->fulljs.','.$this->keyword;
		}
		
		public function prepareFullCode() {

			$html = file_get_contents("defaults/register_form.php");
			$find = '$fullhtml';
			$this->fullhtml = str_replace($find, $this->fullhtml, $html);

			$fulljs = file_get_contents("defaults/register_script.js");
			$find = '$js';
			$this->fulljs = str_replace($find, $this->fulljs, $fulljs);

			$this->fullphp = file_get_contents("defaults/register_backend.php");
			$this->replace("fullphp","all_checks,unique_user,sql1,sql2");
		}
		
		public function rewriteFiles() {
			$folder = $_SESSION["project"];

			// Rewrite PHP file
			$file = fopen($folder."/apps/backend/register/main.php", "w");
			fwrite($file,$this->fullphp);
			fclose($file);

			// Then we start writing the HTML
			$file = fopen($folder."/ui/register/main.php", "w");
			fwrite($file,$this->fullhtml);
			fclose($file);

			// Then we write the JS file
			$file = fopen($folder."/apps/frontend/register/main.js", "w");
			fwrite($file,$this->fulljs);
			fclose($file);	

			echo "success";
		}

	}

?>
    

    
    