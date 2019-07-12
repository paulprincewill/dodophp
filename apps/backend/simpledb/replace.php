<?php

	function replace($target, $variables) {
		$variables = explode(',',$variables);
		for ($i=0; $i<count($variables); $i++) {

			$variable = $variables[$i];
			global $$variable;
			global $$target;

			$$target = str_replace('$'.$variable, $$variable, $$target);
		}
	}