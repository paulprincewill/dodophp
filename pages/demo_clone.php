<?php

	require "../initialize.php";
	$page_link = "demo_clone";
	$page_title = "demo_clone";
	$page_description = "demo_clone";
	$page_keywords = "demo_clone";

	loadHeader("main");
	loadUI("demo1");
	loadUI("demo2");
	loadScript("_lib/loadcode");
	loadScript("_lib/clipboard.min");
	loadScript("_lib/prism");
	loadFooter("main");
