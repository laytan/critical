<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Critical
 * @subpackage Critical/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Critical
 * @subpackage Critical/admin
 * @author     Your Name <email@example.com>
 */
class Critical_Admin {

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
	 * @param      string $critical       The ID of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $critical, $version ) {
		$this->critical = $critical;
		$this->version  = $version;

		if ( $this->check_for_request( $_POST ) ) {
			echo $this->respond_to_minify_request( $_POST['critical-input'], $_POST['critical-test'], 'https://cssminifier.com/raw' );
			exit;
		}
	}

	/**
	 * Register the stylesheets for the admin area.
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

		wp_enqueue_style( $this->critical, plugin_dir_url( __FILE__ ) . 'dist/critical-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
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

		wp_enqueue_script( $this->critical, plugin_dir_url( __FILE__ ) . 'dist/critical-admin.bundle.js', array( 'jquery' ), $this->version, true );
	}

	/**
	 * Hooked on admin_bar_menu to add our toolbar to the page
	 *
	 * @param WP_Admin_Bar $wp_admin_bar the admin bar to run add_node on
	 * @since 1.0.0
	 */
	public function add_toolbar_with_post_id( $wp_admin_bar ) {
		$this->add_toolbar( $wp_admin_bar, get_the_ID() );
	}

	/**
	 * Add the markup for our toolbar
	 *
	 * @param WP_Admin_Bar $wp_admin_bar the admin bar to run add_node on
	 * @since 1.0.0
	 */
	public function add_toolbar( $wp_admin_bar, $post_ID ) {
		$args = array(
			'id'    => 'critical-admin-toolbar',
			'title' => '<span id="critical-admin-toolbar-title">Generate Critical CSS</span> 
				<span style="display: none;" id="critical-admin-toolbar-redirect-to">'
				. esc_url( admin_url( 'admin-post.php' ) ) .
				'</span>
				<span style="display: none;" id="critical-admin-toolbar-post-id">'
				. $post_ID .
				'</span>
				<span style="display: none;" id="critical-admin-toolbar-nonce">'
				. wp_create_nonce( 'critcal-admin-got-css_' . $post_ID ) .
				'</span>',
			'href'  => '#',
		);

		$wp_admin_bar->add_node( $args );
	}

	/**
	 * handles the post request from the front-end on getting css
	 *
	 * @since 1.0.0
	 */
	public function got_css() {
		// Verify request
		$post_ID = intval( $_POST['critical-post-id'] );
		wp_verify_nonce( $_POST['_wpnonce'], 'critical-admin-got-css_' . $post_ID );

		// Sanitize css
		$css = wp_kses_post( $_POST['critical-css'] );

		// Add or update the css to the post
		update_post_meta( $post_ID, 'critical-css', $css );

		// Redirect back to the post
		wp_safe_redirect( get_permalink( $post_ID ) );
	}

	/**
	 * Returns true if the post request has what we want and is of valid types
	 * The string true or false is also allowed
	 *
	 * @since 1.0.0
	 * @param   array $post The post request,
	 *                      the function checks for a critical-input of type string
	 *                      and a critical-test of type bool or string representing a bool.
	 */
	public function check_for_request( $post ) {
		return (
			( array_key_exists( 'critical-input', $post ) && is_string( $post['critical-input'] ) )
			&&
			(
				array_key_exists( 'critical-test', $post )
				&&
				(
					$post['critical-test'] === 'true'
					||
					$post['critical-test'] === 'false'
					||
					is_bool( $post['critical-test'] )
				)
			)
		);
	}

	/**
	 * Returns the wanted response, depending on test or not.
	 *
	 * @since 1.0.0
	 * @param   string      $input      the input of critical css to minify
	 * @param   string|bool $test       is this a test?
	 * @param   string      $url        the api url
	 */
	public function respond_to_minify_request( $input, $test, $url ) {
		if ( $test === true || $test === 'true' ) {
			return 'Test: ' . $input;
		}

		$args = array(
			'body' => array(
				'input' => $input,
			),
		);
		$res  = wp_remote_retrieve_body( wp_remote_post( $url, $args ) );
		return wp_kses_post( $res );
	}
}
