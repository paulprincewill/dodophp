<?php     

        function dd_compile($folder, $name, $extension) {

            // First we loop through all the files
            $path    = $folder;
            $single_file = "$path/_$name.$extension";
            $single_fileName = "_$name.$extension";

            $files = preg_grep('~\.'.$extension.'$~', scandir($path));
            $files = array_diff($files, array($single_fileName)); // Exclude the current single file
            $files = array_values($files); // Rearrange the index to start from zero


            // Get all file contents
            $all_contents = "";
            for ($i=0; $i < count($files); $i++) {

                $content = file_get_contents($path.'/'.$files[$i]);
                $all_contents .= $content;

            }

            // Rewrite to a single file
            $file = fopen($single_file, "w");
            fwrite($file,$all_contents);
            fclose($file);	

            return $single_fileName;
        }


        dd_compile(JS .$page_link, 'scripts.dd', 'js');
        dd_compile(UI .'_css', 'general.dd', 'css');
        dd_compile(UI .$page_link, 'styles.dd', 'css');