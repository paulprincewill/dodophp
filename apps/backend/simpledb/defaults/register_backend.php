<?php
	include "../../../dodo/load2.php";

	if (isset($_POST['register'])) {

		// Include file that do the checking
		require DODO."functions/data.php";
		$all_checks

		if ($dt->there_is_error()) {
			echo $dt->error;
		} else {

			// Check if user is already registered
			require APP."user/if_registered.php";

			if (user_is_registered($$unique_user)) {
				echo "Hay! You've already registered - <a href='login'> Click to login </a>";
			}

			else {
				$password = $dt->encrypt($password);
				$db->sql("INSERT INTO users ($sql1) VALUES($sql2)");
				$_SESSION[PREFIX."_user"] = $$unique_user;
				echo "success";
			}

		}
	}