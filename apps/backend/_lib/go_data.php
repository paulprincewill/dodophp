<?php
    
    class go {
        private $existingData = [];
        private $file = '';
        private $data = [];
        
        public function __construct() {  
        }
        
        public function loadFile($file = '') {
            
            // If no file is specified, use current file name
            if ($file == '') {
                $page_link = basename($_SERVER['REQUEST_URI']);
                $page_link = explode('?', $page_link);
                $page_link = $page_link[0];
                $file = $page_link.'.data.json';
            }
            
            
            $this->file = $file;
            // If file does not exist, a new one will be created
            if (file_exists($file)) {
                $data = file_get_contents($file);
                if ($data !='') {
                    
                    $data = json_decode($data, true);
                    if (is_array($data)) { 
                        $this->existingData = $data;
                    } else {
                        echo $file.' contains content that is not in JSON, please delete manually';
                        return false;
                    }
                }
            }
            
            return true;
        }
        
        private function prepareData() {
            
            if (isset($_REQUEST)) {     
                $this->data = $_REQUEST;
            } else {
                echo "No data was received";
            }
        }
        
        public function saveData($file = '') {
            
                
            $this->prepareData();
            if ($this->loadFile($file)) {
                
                $this->data['_id'] = $this->last_id();
                array_push($this->existingData, $this->data);
                $data = json_encode($this->existingData);
                $file = fopen($this->file, "w");
                fwrite($file,$data);
                fclose($file);
            }
        }
        
        private function last_id() {
            if (count($this->existingData) > 0) {
                $last_id = end($this->existingData);
                $last_id = $last_id['_id'];
                $last_id = $last_id+1;
                return $last_id;
            } else {
                return 1;
            }
        }
        
        public function getData($where, $what) {
            
            $data = $this->existingData;
            for ($i=0; $i<count($data); $i++) {
               
                if (array_key_exists($where,$data[$i])) {
                   if ($data[$i][$where] == $what) {
                       return $data[$i];
                   }
                }
            }
        }
        
        public function getAllData() {
            return $this->existingData;
        }
    }

    $go = new go;