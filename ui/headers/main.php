<!DOCTYPE html>
<html>
<head>
	<title> <?php echo $page_title ?> | DoDo Framework </title>

	<link rel='stylesheet' href="_assets/fonts/metropolis/font.css">
	<link rel='stylesheet' href="_assets/icons/pe-icon/styles/pe-icon.css">
	<link rel='stylesheet' href="_assets/icons/pe-icon/styles/helper.css">
	<link rel="stylesheet" type="text/css" href="ui/_css/_general.dd.css">
	<link rel="stylesheet" type="text/css" href="ui/_css/dodo/_dodo.dd.css">
	<link rel="stylesheet" type="text/css" href="ui/<?php echo $page_link ?>/_styles.dd.css">

</head>
<body>
    
	<dd_loader>
		<div dd_onload></div>
		<div dd_ajaxload></div>
	</dd_loader>
    
	<header></header>
	<main id="page_<?php echo $page_link?>">