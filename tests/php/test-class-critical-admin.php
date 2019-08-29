<?php

// Class to mock
class WP_Admin_Bar {

	public function add_node() {
	}
}

class Test_Critical_Admin extends WP_UnitTestCase {


	private $class_instance;

	public function setUp() {
		parent::setUp();

		$this->class_instance = new Critical_Admin( 'critical', '1.0.0' );
	}

	public function test_add_toolbar_returns_array() {
		// Mock the add_node function and assert for an array in it
		$mock = $this->createMock( WP_Admin_Bar::class );
		$mock->method( 'add_node' )
			->will(
				$this->returnCallback(
					function ( $arg ) {
						$this->assertTrue( is_array( $arg ) );
					}
				)
			);
		$this->class_instance->add_toolbar( $mock, 1 );
	}

	public function test_add_toolbar_returns_title_with_embedded_redirect_link() {
		$mock = $this->createMock( WP_Admin_Bar::class );
		$mock->method( 'add_node' )
			->will(
				$this->returnCallback(
					function( $arg ) {
						$this->assertRegexp( '/id="critical-admin-toolbar-redirect-to"/', $arg['title'] );
					}
				)
			);
		$this->class_instance->add_toolbar( $mock, 1 );
	}

	public function test_add_toolbar_returns_title_with_embedded_post_id() {
		$mock = $this->createMock( WP_Admin_Bar::class );
		$mock->method( 'add_node' )
			->will(
				$this->returnCallback(
					function( $arg ) {
						$this->assertRegexp( '/id="critical-admin-toolbar-post-id">1/', $arg['title'] );
					}
				)
			);
		$this->class_instance->add_toolbar( $mock, 1 );
	}

	public function test_add_toolbar_returns_title_with_embedded_nonce() {
		$mock = $this->createMock( WP_Admin_Bar::class );
		$mock->method( 'add_node' )
			->will(
				$this->returnCallback(
					function( $arg ) {
						$this->assertRegexp( '/id="critical-admin-toolbar-nonce"/', $arg['title'] );
					}
				)
			);
		$this->class_instance->add_toolbar( $mock, 1 );
	}

	public function test_respond_to_minify_request_returns_constant_with_test_true() {
		$res = $this->class_instance->respond_to_minify_request( 'test', true, 'example.com' );
		$this->assertRegexp( '/Test:/', $res );
	}

	public function test_respond_to_minify_request_returns_minified_with_test_false() {
		$res = $this->class_instance->respond_to_minify_request( 'test', false, 'example.com' );
		// not containing the string Test:
		$this->assertRegexp( '/^((?!Test:).)*$/', $res );
	}

	public function test_check_for_request_returns_true_if_data_is_present() {
		$res = $this->class_instance->check_for_request(
			array(
				'critical-input' => 'test',
				'critical-test'  => true,
			)
		);
		$this->assertTrue( $res );
	}

	public function test_check_for_request_returns_false_if_data_is_not_present() {
		$res = $this->class_instance->check_for_request(
			array(
				'critical-test' => 'test',
			)
		);
		$this->assertFalse( $res );
	}

	public function test_check_for_request_returns_true_on_string_boolean_critical_test_argument() {
		$res = $this->class_instance->check_for_request(
			array(
				'critical-test'  => 'true',
				'critical-input' => 'test',
			)
		);
		$this->assertTrue( $res );
	}

	public function test_check_for_request_returns_false_on_invalid_critical_input_argument() {
		$res = $this->class_instance->check_for_request(
			array(
				'critical-test'  => true,
				'critical-input' => true,
			)
		);
		$this->assertFalse( $res );
	}
}
