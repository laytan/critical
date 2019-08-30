<?php
class Test_Critical_Public extends WP_UnitTestCase {


	private $class_instance;

	public function setUp() {
		parent::setUp();

		$this->class_instance = new Critical_Public( 'critical', '1.0.0' );
	}

	public function test_has_defer_attributes_returns_true_on_preload_in_element() {
		$res = $this->class_instance->has_defer_attributes( '<link href="#" rel="preload">' );
		$this->assertTrue( $res );
	}

	public function test_has_defer_attributes_returns_true_on_onload_in_element() {
		$res = $this->class_instance->has_defer_attributes( '<link href="#" rel="stylesheet" onload="this.rel = stylesheet">' );
		$this->assertTrue( $res );
	}

	public function test_has_defer_attributes_returns_false_on_regular_element() {
		$res = $this->class_instance->has_defer_attributes( '<link href="localhost:7000" rel="stylesheet">' );
		$this->assertFalse( $res );
	}
}
