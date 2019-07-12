<?php
	require("../dodo/load.php");
	$page_title = "$page";
	include UI ."headers/main.php";
	include UI ."$page/main.php"; 
	include UI ."footers/footer.php";
	loadScripts("$page");