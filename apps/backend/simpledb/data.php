<?php

	/* This PHP code is meant for data validation [and sanitization]. 
		It first sanitize it, then checks it,
		then returns the data
	*/
	
	class dt {
		
		public $minimum;
		public $maximum;
		public $maximum_words;
		public $compare;
		public $data;
		public $title;
		public $error = "";
	
		// Function for sanitizing data
		public function sanitize($data) {
			
			// This one trims it of all spaces
			$data = trim($data);
			
			// This one strips away all html/code tags
			$data = strip_tags($data);
			
			// This one strips away all slashes
			$data = stripslashes($data);
			
			// This one removes all html special characters
			$data = htmlspecialchars($data);
	
			// FInally, the data is returned
			return $data;

		}
	
		// Get the data
		public function getData($data) {
			
			// Save the data as data title first
			$this->title = str_replace('_', ' ', $data); // Break title with spaces
			
			// Get the data from FORM
			$data = $_POST["$data"];
			
			// Sanitize the data
			$this->data = $this->sanitize($data);

			return $this->data;	
			
		}
		
		/*  ----------------------
		------------------------------
		----------------------------------- These are the various checks
		
		*/
		
		// This will check if data meets the minimum characters set
		protected function if_minimum() {
			if (strlen($this->data) < $this->minimum) {
				$this->error = "Your ". $this->title ." should not be less than ". $this->minimum. " characters";
			}
		}

		// This will check if data exceeds the maximum characters set
		protected function if_maximum() {
			if (strlen($this->data) > $this->maximum) {
				$this->error = "Your ". $this->title ." should not be more than ". $this->maximum. " characters";
			}
		}

		// Check if data is empty
		protected function if_empty() {
			if (empty($this->data)) {
				$this->error = "You left the ". $this->title ." field empty";
				return true;
			}
		}
		
		// Check if data is a valid URL
		protected function if_url() {
			if (filter_var($this->data, FILTER_VALIDATE_URL) === false) {
				$error = 1;
				$this->error = "You did not type in a valid link (e.g https://google.com)";
			}
		}
		
		// Check if data contains only alphabelt
		protected function if_alphabelt() {
			if (!preg_match("/^[a-zA-Z ]+$/",$this->data)) {
				$this->error =  $this->title ." should contain only letters";
			}
		}
		
		// Check if data contians only numbers	
		protected function if_number() {
			if (!preg_match("/^[0-9]*$/", $this->data)) {
				$this->error = $this->title ." should contain only numbers";
			}
		}

		// Check if data is in email format
		protected function if_email() {
			if (!filter_var($this->data, FILTER_VALIDATE_EMAIL)) {
				$this->error = $this->title ." should be in email format only";
			}
		}

		// Check if data exceeds maximum words 
		protected function maximum_words() {
			if (str_word_count($this->data) > $this->maximum_words) {
				$this->error = $this->title ." should not contain more than". $this->maximum_words . " words";
			}
		}

		// Check if two items matches
		protected function compare() {
			if ($this->data !== $this->compare) {
				$this->error = $this->title ." does not match";
			}
		}
		
		
		// This function will do the checking
		public function check($checks) {

			// We first check if the data is not empty
			if (!$this->if_empty()) {
				// We remove space if any
				$checks = str_replace(' ', '', $checks);

				// Then we convert to array of checks
				$checks = explode(",",$checks);

				// Then we loop through the checks, and we perform each one by one
				for ($i=0; $i < count($checks); $i++) {
				
					$whattocheck = $checks[$i];
					$this->$whattocheck();
				}
			}
			
		}


		public function there_is_error() {
			if ($this->error !="") {
				return true;
			}
			else {
				return false;
			}
		}

		// This function will do a single check with custom error
		public function singleCheck($whattocheck, $error) {
			
			// We first check if the data is not empty
			if (!$this->if_empty()) {

				$this->$whattocheck();
				// If there is error, use custom error message instead
				if ($this->there_is_error()) {
					$this->error = $error;
				}
			}
		}

		public function encrypt($data) {
			$data = $data.PREFIX;
			return md5($data);
		}

	}

	$dt = new dt();
?>