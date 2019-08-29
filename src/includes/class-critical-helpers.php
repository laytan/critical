<?php

/**
 * The file that defines the helper plugin class
 *
 * @link       https://github.com/laytan
 * @since      1.0.0
 *
 * @package    Critical
 * @subpackage Critical/includes
 */

/**
 * Class that houses all static helper functions
 *
 * @since      1.0.0
 * @package    Critical
 * @subpackage Critical/includes
 * @author     Laytan Laats <laytanlaats@hotmail.com>
 */
class Critical_Helpers {

	/**
	 * Replaces needle with replace in the string haystack
	 */
	public static function replace_first( $needle, $haystack, $replace ) {
		$pos = strpos( $haystack, $needle );
		if ( false !== $pos ) {
			$new_string = substr_replace( $haystack, $replace, $pos, strlen( $needle ) );
			return $new_string;
		}
		return false;
	}
}
