/**
 * Class that holds all our public facing javascript logic.
 * Note: This JS is only ran when the user is an admin.
 */
class Critical_Public {

	/**
	 * Get the class ready to function
	 * 
	 * @since 1.0.0
	 * @param {function} JQuery JQuery dependency  
	 */
	constructor(JQuery) {
		this.$ = JQuery;
	}

	/**
	 * Helper function to get the JQuery toolbar btn element
	 * 
	 * @since 1.0.0
	 * @returns {object} JQuery element
	 */
	getToolbarBtn() {
		console.log(this.$);
		return this.$('#wp-admin-bar-critical-admin-toolbar');
	}

	/**
	 * Redirect to the specified url by back-end with the gathered css
	 * 
	 * @since 1.0.0
	 * @param {string} outputCSS CSS text
	 */
	redirect(outputCSS) {
		const toolbarBtn = this.getToolbarBtn();
		const redirectTo = toolbarBtn.find('#critical-admin-toolbar-redirect-to').text();
		const postID = toolbarBtn.find('#critical-admin-toolbar-post-id').text();
		const nonce = toolbarBtn.find('#critical-admin-toolbar-nonce').text();

		this.$('<form></form>')
			.attr('action', redirectTo)
			.attr('method', 'POST')
			.append([
				this.$('<input>')
					.attr('name', 'critical-css')
					.val(outputCSS),
				this.$('<input>')
					.attr('name', 'critical-post-id')
					.val(postID),
				this.$('<input>')
					.attr('name', 'action')
					.val('critical_got_css'),
				this.$('<input>')
					.attr('name', '_wpnonce')
					.val(nonce),
			])
			.css('display', 'none')
			.appendTo(this.$('body'))
			.submit();
	}

	/**
	 * Event handler for the toolbar button / main functions
	 * 
	 * @since 1.0.0
	 * @param {event} e
	 */
	generateCriticalCSS(e) {
		const toolbar = this.getToolbarBtn();
		toolbar.find('#critical-admin-toolbar-title').text('').addClass('critical-loader');

		const cssFiles = this.getAllCSS();

		// Combine all css into one
		const combinedCSS = cssFiles.join('\n');

		// Minify the css
		this.minify(combinedCSS, (minifiedCSS) => {
			toolbar.find('#critical-admin-toolbar-title').text('Generate Critical CSS').removeClass('critical-loader');
			this.showOptions(minifiedCSS);
		});
	}

	/**
	 * Gets all links with rel="stylesheet" and returns their contents in an array
	 * 
	 * @since 1.0.0
	 * @returns {string[]} array of links
	 */
	getAllCSS() {
		// TODO: Only generate css from non-admin styles
		const stylesheets = this.$('link[rel="stylesheet"]');
		let cssStrings = [];
		stylesheets.each((i, stylesheet) => {
			const link = stylesheet.href;
			if (!link.includes("admin")) {
				cssStrings.push(this.criticalCSS(link));
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
	minify(input, cb) {
		//TODO: dynamic url
		this.$.ajax('http://localhost/daub/', {
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
	criticalCSS(url) {
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

	showOptions(css) {
		const closeModal = (e) => {
			this.$(e.target).parents('.critical-modal').toggleClass('critical-show-modal');
		}

		const modal =
			this.$('<div></div>').addClass('critical-modal critical-show-modal')
				.append(this.$('<div></div>').addClass('critical-modal-content')
					.append([
						this.$('<span></span>').addClass('critical-close-button critical-button critical-top-right').html("&times;"),
						this.$('<h1></h1>').text("Critical CSS"),
						this.$('<hr>'),
						this.$('<details></details>').addClass('critical-css-details').append([this.$('<summary></summary>').text("Toggle CSS"), this.$('<p></p>').text(css)]),
						this.$('<button></button>').addClass('critical-button critical-primary-button').text('Insert Critical CSS & Defer other CSS').on('click', () => {
							this.redirect(css);
						}),
						// TODO: Implement
						this.$('<button></button>').addClass('critical-button').text('Insert Critical CSS & Do not defer other CSS'),
						this.$('<button></button>').addClass('critical-close-button critical-button critical-secondary-button').text('Cancel'),
					])
				);
		this.$('body').append(modal);
		modal.find('.critical-close-button').on('click', closeModal);
	}
}