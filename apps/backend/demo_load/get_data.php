<?php
    
    if (isset($_GET['name'])) {
        $x['msg'] = 'Your name is '.$_GET['name'];
    } else {
        $x['msg'] = 'it did not work';
    }

    echo json_encode($x);