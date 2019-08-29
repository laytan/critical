const Critical_Public = require('./class-critical-public');

(function ($) {
	'use strict';

	/**
	 * An interface for the critical public class.
     * This is separated so the class can be tested.
	 * 
	 * Note: This JS is only loaded when a user with current user can edit pages is on the public-facing pages,
     *       The plugin does not have any public-facing JS for non privileged users
	 */

	/**
	 * Add a click event to the wp toolbar button
	 * 
	 * @since 1.0.0
	 */
	$(window).load(function () {
		const CriticalPublic = new Critical_Public($);

		CriticalPublic.getToolbarBtn().on('click', function (e) {
			CriticalPublic.generateCriticalCSS(e);
		});
	});

})(jQuery);