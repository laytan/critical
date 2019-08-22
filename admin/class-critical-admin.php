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
	 * @param      string    $critical       The ID of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $critical, $version ) {

		$this->critical = $critical;
		$this->version  = $version;

		// TODO: Put somewhere else
		// phpcs:disable
		if ( $_POST['critical-input'] ) {
		// phpcs:enable
			$url  = 'https://cssminifier.com/raw';
			$args = array(
				'body' => array(
					// phpcs:disable
					'input' => $_POST['critical-input'],
					// phpcs:enable
				),
			);
			$res = wp_remote_retrieve_body( wp_remote_post( $url, $args ) );
			echo wp_kses_post( $res );
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

		wp_enqueue_style( $this->critical, plugin_dir_url( __FILE__ ) . 'css/critical-admin.css', array(), $this->version, 'all' );

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

		wp_enqueue_script( $this->critical, plugin_dir_url( __FILE__ ) . 'js/critical-admin.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * Add the markup for our toolbar, onclick will be done in the js
	 *
	 * @since 1.0.0
	 * @param WP_Admin_Bar The admin bar global variable
	 */
	public function add_toolbar( $wp_admin_bar ) {
		$post_ID = get_the_ID();
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
}
