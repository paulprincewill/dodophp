<?php

	require "../initialize.php";
	$page_link = "demo_load";
	$page_title = "demo_load";
	$page_description = "demo_load";
	$page_keywords = "demo_load";

	loadHeader("main");
	loadUI("demo1");
	loadUI("demo2");
	loadUI("demo3");
	loadUI("demo4");
	loadUI("demo5");
	loadScript("_lib/loadcode");
	loadScript("_lib/clipboard.min");
	loadScript("_lib/prism");
	loadFooter("main");
