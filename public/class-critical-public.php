<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://github.com/laytan
 * @since      1.0.0
 *
 * @package    Critical
 * @subpackage Critical/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Critical
 * @subpackage Critical/public
 * @author     Laytan Laats <laytanlaats@hotmail.com>
 */
class Critical_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $critical    The ID of this plugin.
	 */
	private $critical;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $critical       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $critical, $version ) {

		$this->critical = $critical;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Critical_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Critical_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// * This plugin only needs front-end styling when an admin is on the front-end
		if ( current_user_can( 'edit_pages' ) ) {
			wp_enqueue_style( $this->critical, plugin_dir_url( __FILE__ ) . 'css/critical-public.css', array(), $this->version, 'all' );
		}
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Critical_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Critical_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// * This plugin only needs the javascript once an admin is on the front-end
		if ( current_user_can( 'edit_pages' ) ) {
			wp_enqueue_script( $this->critical, plugin_dir_url( __FILE__ ) . 'js/critical-public.js', array( 'jquery', $this->critical . '-class' ), $this->version, false );
			wp_enqueue_script( $this->critical . '-class', plugin_dir_url( __FILE__ ) . 'js/class-critical-public.js', array(), $this->version, false );
		}
	}

	/**
	 * Hook in wp_head, check for critical css and output the critical css
	 *
	 * @since    1.0.0
	 */
	public function insert_critical_css() {
		$post_ID      = get_the_ID();
		$critical_css = get_post_meta( $post_ID, 'critical-css', true );
		if ( strlen( $critical_css ) > 0 ) {
			echo '<style type="text/css">' . wp_kses_post( $critical_css ) . '</style>';
		}
	}

	/**
	 * Filter for all css rules, changes html to preload the css if there is critical css present for the post
	 *
	 * @since    1.0.0
	 * @param    string    $html      the HTML content of the css link
	 * @param    string    $handle    the handle/slug of the enqueued style
	 * @return   string               HTML of the styling changed to defer with rel preload
	 */
	public function defer_non_critical_css( $html, $handle ) {
		// Only defer stylesheets when critical css is present for the page
		$critical_css = get_post_meta( get_the_ID(), 'critical-css', true );
		if ( strlen( $critical_css ) < 1 ) {
			return $html;
		}

		// Make sure preload and onload is not already in the html
		if ( ( strpos( $html, 'preload' ) !== false || strpos( $html, 'onload' ) !== false ) ) {
			return $html;
		}

		// Change rel="stylesheet" to rel="preload"
		$new_html = Critical_Helpers::replace_first( 'stylesheet', $html, 'preload' );
		if ( false === $new_html ) {
			return $html;
		}

		// Add the rest of the attributes for preloading
		$with_onload = Critical_Helpers::replace_first( ' ', $new_html, ' as="style" onload="this.onload=null;this.rel=\'stylesheet\'" ' );

		// Add no javascript support
		// TODO: This outputs the style in quotes
		// $output      = $with_onload . '<noscript>' . $html . '</noscript>';
		// var_dump(esc_html($output));
		return $with_onload;
	}
}
