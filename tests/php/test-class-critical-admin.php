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
}
