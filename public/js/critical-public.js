(function ($) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 * 
	 * Note: This CSS is only loaded when a user with current user can edit pages is on the public-facing pages,
     *       The plugin does not have any public-facing CSS for non privileged users
	 */

	/**
	 * Add a click event to the wp toolbar button
	 * 
	 * @since 1.0.0
	 */
	$(window).load(function () {
		// Add on click listener for our toolbar button
		getToolbarBtn().on('click', generateCriticalCSS);
	});

	/**
	 * Helper function to get the JQuery toolbar btn element
	 * 
	 * @since 1.0.0
	 * @returns {object} JQuery element
	 */
	function getToolbarBtn() {
		return $('#wp-admin-bar-critical-admin-toolbar');
	}

	/**
	 * Redirect to the specified url by back-end with the gathered css
	 * 
	 * @since 1.0.0
	 * @param {string} outputCSS CSS text
	 */
	function redirect(outputCSS) {
		const toolbarBtn = getToolbarBtn();
		const redirectTo = toolbarBtn.find('#critical-admin-toolbar-redirect-to').text();
		const postID = toolbarBtn.find('#critical-admin-toolbar-post-id').text();
		const nonce = toolbarBtn.find('#critical-admin-toolbar-nonce').text();

		$('<form></form>')
			.attr('action', redirectTo)
			.attr('method', 'POST')
			.append([
				$('<input>')
					.attr('name', 'critical-css')
					.val(outputCSS),
				$('<input>')
					.attr('name', 'critical-post-id')
					.val(postID),
				$('<input>')
					.attr('name', 'action')
					.val('critical_got_css'),
				$('<input>')
					.attr('name', '_wpnonce')
					.val(nonce),
			])
			.css('display', 'none')
			.appendTo($('body'))
			.submit();
	}

	/**
	 * Event handler for the toolbar button / main functions
	 * 
	 * @since 1.0.0
	 * @param {event} e
	 */
	function generateCriticalCSS(e) {
		const toolbar = getToolbarBtn();
		toolbar.find('#critical-admin-toolbar-title').text('').addClass('critical-loader');

		const cssFiles = getAllCSS();

		// Combine all css into one
		const combinedCSS = cssFiles.join('\n');

		// Minify the css
		minify(combinedCSS, function (minifiedCSS) {
			toolbar.find('#critical-admin-toolbar-title').text('Generate Critical CSS').removeClass('critical-loader');
			showOptions(minifiedCSS);
		});
	}

	/**
	 * Gets all links with rel="stylesheet" and returns their contents in an array
	 * 
	 * @since 1.0.0
	 * @returns {string[]} array of links
	 */
	function getAllCSS() {
		// TODO: Only generate css from non-admin styles
		const stylesheets = $('link[rel="stylesheet"]');
		let cssStrings = [];
		stylesheets.each(function (i, stylesheet) {
			const link = stylesheet.href;
			if (!link.includes("admin")) {
				cssStrings.push(criticalCSS(link));
			} else {
				console.log("Admin css:", link);
			}
		});
		return cssStrings;
	}

	/**
	 * Sends the input to the back-end async and waits for the back-end to send back minified CSS,
	 * using API on back-end to minify (API can't be accessed from client)
	 * 
	 * @since 1.0.0
	 * @param {string} input The CSS to minify
	 * @param {function} cb Function to call with minified css
	 */
	function minify(input, cb) {
		//TODO: dynamic url
		$.ajax('http://localhost/daub/', {
			method: 'POST',
			data: {
				"critical-input": input,
			},
			success: function (data) {
				cb(data);
			},
			error: function (err) {
				console.error(err);
			},
		});
	}

	/**
	 * Returns the critical CSS for a given stylesheet link
	 * 
	 * @since 1.0.0
	 * @param {string} url Stylesheet url / part of url to check for
	 * @returns {string}
	 */
	function criticalCSS(url) {
		console.log("Processing: " + url);
		var sheets = document.styleSheets,
			maxTop = window.innerHeight,
			critical = [];

		function aboveFold(rule) {
			if (!rule.selectorText) {
				return false;
			}
			var selectors = rule.selectorText.split(","),
				criticalSelectors = [];
			if (selectors.length) {
				for (var l in selectors) {
					var elem;
					try {
						// webkit is really strict about standard selectors getting passed-in
						elem = document.querySelector(selectors[l]);
					}
					catch (e) { }
					if (elem && elem.offsetTop <= maxTop) {
						criticalSelectors.push(selectors[l]);
					}
				}
			}
			if (criticalSelectors.length) {
				return criticalSelectors.join(",") + rule.cssText.match(/\{.+/);
			}
			else {
				return false;
			}
		}

		for (var i in sheets) {
			var sheet = sheets[i],
				href = sheet.href,
				rules = sheet.cssRules,
				valid = true;

			if (url && href && href.indexOf(url) > -1) {
				for (var j in rules) {
					var media = rules[j].media,
						matchingRules = [];
					if (media) {
						var innerRules = rules[j].cssRules;
						for (var k in innerRules) {
							var critCSSText = aboveFold(innerRules[k]);
							if (critCSSText) {
								matchingRules.push(critCSSText);
							}
						}
						if (matchingRules.length) {
							try {
								matchingRules.unshift("@media " + media.mediaText + "{");
								matchingRules.push("}");
							} catch (e) {
								console.warn(e.message, sheet);
							}
						}

					}
					else if (!media) {
						var critCSSText = aboveFold(rules[j]);
						if (critCSSText) {
							matchingRules.push(critCSSText);
						}
					}
					critical.push(matchingRules.join("\n"));
				}

			}
		}
		console.log("Critical css:", critical.join("\n"));
		return critical.join("\n");
	}

	function showOptions(css) {
		const closeModal = function (e) {
			$(e.target).parents('.critical-modal').toggleClass('critical-show-modal');
		}

		const modal =
			$('<div></div>').addClass('critical-modal critical-show-modal')
				.append($('<div></div>').addClass('critical-modal-content')
					.append([
						$('<span></span>').addClass('critical-close-button critical-button critical-top-right').html("&times;"),
						$('<h1></h1>').text("Critical CSS"),
						$('<hr>'),
						$('<details></details>').addClass('critical-css-details').append([$('<summary></summary>').text("Toggle CSS"), $('<p></p>').text(css)]),
						$('<button></button>').addClass('critical-button critical-primary-button').text('Insert Critical CSS & Defer other CSS').on('click', function () {
							redirect(css);
						}),
						// TODO: Implement
						$('<button></button>').addClass('critical-button').text('Insert Critical CSS & Do not defer other CSS'),
						$('<button></button>').addClass('critical-close-button critical-button critical-secondary-button').text('Cancel'),
					])
				);
		$('body').append(modal);
		modal.find('.critical-close-button').on('click', closeModal);
	}
})(jQuery);
