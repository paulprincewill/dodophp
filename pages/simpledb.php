<?php

	require "../initialize.php";
	$page_link = "simpledb";
	$page_title = "simpledb";
	$page_description = "simpledb";
	$page_keywords = "simpledb";

	loadHeader("main");
	loadUI("header");
	loadUI("main");
	loadUI("fields");
	loadUI("actions");
	loadUI("preview");
	loadUI("done");

    loadTemplate("template_input");
	loadFooter("main");
