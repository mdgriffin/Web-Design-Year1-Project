(function () {

	/**
	 *
	 * Helper Functions for adding and removing classes
	 *
	 */

	var removeClass = function (element, classToRemove) {
		element.className = element.className.split(" ").map(function (currentClass, index, arr) {
			if (currentClass !== classToRemove) {
				return currentClass;
			}
		}).join(" ").replace(/ {2,}/g, "");
	};

	var removeClassAll = function (elList, classToRemove) {
		for (var i = 0; i < elList.length; i++) {
			removeClass(elList[i], classToRemove);
		}
	};

	var addClass = function (element, classToAdd) {
		// just in case the class is already there, remove it
		removeClass(element, classToAdd);
		element.className += " " + classToAdd;
	};

	/**
	  *
	  * Sets the countdown timer with the number of days, hours minutes and second left until
	  * the festival commences
	  *
	  **/

	// self invoking function to create scope
	(function () {

		var festivalStart = Date.parse('July 8 2017 13:00:00 GMT+00:00'),
			daysEl = document.getElementById("js-countdownDays"),
			hoursEl = document.getElementById("js-countdownHours"),
			minutesEl = document.getElementById("js-countdownMinutes"),
			secondsEl = document.getElementById("js-countdownSeconds");

		var setCountdownTime = function () {

			var timeDifference = festivalStart - Date.parse(new Date());

			daysEl.innerHTML = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
			hoursEl.innerHTML = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
			minutesEl.innerHTML = Math.floor((timeDifference / 1000/60) % 60);
			secondsEl.innerHTML = Math.floor((timeDifference / 1000) % 60);

		};

		// check that the festival was not in the past
		if (festivalStart - Date.parse(new Date()) > 0) {
			setCountdownTime();
			window.setInterval(setCountdownTime, 1000);
		}

	})();

	/**
	 *
	 * Festival Programme Tabs
	 *
	 **/

	(function () {

		function tabbedNav (tabAnchors) {
			this.tabAnchors = tabAnchors;
			this.tabElements = [];

			this.init();
		}

		tabbedNav.prototype = {
			init: function () {
				var tabElement;

				for (var i = 0;i < this.tabAnchors.length; i++) {
					tabElement = document.querySelector(this.tabAnchors[i].getAttribute("href"));

					if (tabElement) {
						this.tabElements.push(tabElement);
					}

					this.tabAnchors[i].addEventListener("click", this.onTabClickEvent.bind(this));
				}
			},

			showTab: function (tabAnchor) {
				var targetTabElement = this.getTabElementFromId(tabAnchor.getAttribute("href"));

				if (targetTabElement){

					removeClassAll(this.tabAnchors, "selected");
					removeClassAll(this.tabElements, "active");

					addClass(tabAnchor, "selected");
					addClass(targetTabElement, "active");
				}
			},
			onTabClickEvent: function (event) {
				event.preventDefault();
				this.showTab(event.target);
			},
			getTabElementFromId: function (id) {
				var matchedTab;

				for(var i = 0; i < this.tabElements.length; i++) {
					if (this.tabElements[i].getAttribute("id") === id.substring(1)) {
						matchedTab = this.tabElements[i];
						break;
					}
				}

				return matchedTab;
			},
			getTabAnchorFromId: function (id) {
				var matchedAnchor;

				for(var i = 0; i < this.tabAnchors.length; i++) {
					if (this.tabAnchors[i].getAttribute("href") === id) {
						matchedAnchor = this.tabAnchors[i];
						break;
					}
				}

				return matchedAnchor;
			},
			getURLHash: function () {
				var urlIDPattern = /\#[a-z]+/gi;
				var matchedHash = urlIDPattern.exec(window.location.href);

				if (matchedHash) {
					return matchedHash[0];
				} else {
					return matchedHash;
				}
			},
			showWindowUrlTab: function () {
				var tabHash = this.getURLHash();

				// if the url has a hash ID in it, show the correct tab
				if (tabHash) {
					var matchedTabAnchor = this.getTabAnchorFromId(tabHash);

					if (matchedTabAnchor) {
						this.showTab(matchedTabAnchor);
					}
				}
			},
			attachHashChangeEvent: function () {
				var self = this;
				window.addEventListener("hashchange", function () {
					var tabHash = self.getURLHash();
					if (tabHash) {
						var matchedTabAnchor = self.getTabAnchorFromId(tabHash);

						if (matchedTabAnchor) {
							self.showTab(matchedTabAnchor);
						}
					}
				});
			}
		};

		var scheduleTabAnchors = document.querySelectorAll(".programme-days a");

		if (scheduleTabAnchors.length) {
			var scheduleTabs = new tabbedNav(scheduleTabAnchors );
			scheduleTabs.showWindowUrlTab();
			scheduleTabs.attachHashChangeEvent();
		}

	})();

	/**
	 *
	 * Back To Top Button
	 *
	 */

	(function () {

		// hide the button until we have scolled beyond half the window height
		var scrollToTopButton = document.querySelector(".backToTop");
		var buttonVisible = false;
		var scrolling = false;

		if (scrollToTopButton) {

			window.addEventListener("scroll", function(event) {

				if (document.body.scrollTop > (window.innerHeight / 2) && !buttonVisible) {
					addClass(scrollToTopButton, "show");
					buttonVisible = true;
				} else if (document.body.scrollTop < (window.innerHeight / 2) && buttonVisible) {
					removeClass(scrollToTopButton, "show");
					buttonVisible = false;
				}

			});

			// bind the click event so that
			scrollToTopButton.addEventListener("click", function (event) {

				if (!scrolling) {

					var clickTarget = document.getElementById(scrollToTopButton.getAttribute("href").substring(1));

					if (clickTarget) {
						var clickTargetTop = clickTarget.scrollTop;
						var currentScrollTop = document.body.scrollTop;
						var totalScrollTop = document.body.scrollTop;
						var increments = 100;
						var duration = 150;
						var scrollPerFrame = totalScrollTop / increments;

						event.preventDefault();

						scrolling = true;

						var timer = setInterval(function () {

							currentScrollTop -= scrollPerFrame;
							window.scrollTo(0, currentScrollTop);

							if (currentScrollTop <= 0) {
								clearInterval(timer);
								scrolling = false;
							}

						}, duration / increments);

					}

				}

			});

		}

	})();

	/**
	 *
	 * Google Home Page Map
	 *
	 **/

	(function () {

		var mapElement = document.getElementById('map');
		var mapStyles = [
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [{"color": "#004358"}]
			},
			{
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [{"color": "#1f8a70"}]
			},
			{
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [{"color": "#1f8a70"}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [{"color": "#fd7400"}]
			},
			{
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [
					{"color": "#1f8a70"},
					{"lightness": -20}
				]
			},
			{
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [
					{"color": "#1f8a70"},
					{"lightness": -17}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
					{"color": "#ffffff"},
					{"visibility": "on"},
					{"weight": 0.9}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
					{"visibility": "on"},
					{"color": "#ffffff"}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels",
				"stylers": [
					{"visibility": "simplified"}
				]
			},
			{
			"elementType": "labels.icon",
			"stylers": [
			{
			"visibility": "off"
			}
			]
			},
			{
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [
					{"color": "#1f8a70"},
					{"lightness": -10}
				]
			},
			{},
			{
				"featureType": "administrative",
				"elementType": "geometry",
				"stylers": [
					{"color": "#1f8a70"},
					{"weight": 0.7}
				]
			}
		];

		if (mapElement) {

			window.initMap = function() {
				var map = new google.maps.Map(mapElement, {
					center: {lat: 52.056924, lng: -9.50974},
					scrollwheel: false,
					zoom: 12,
					styles: mapStyles,
					streetViewControl: false,
					mapTypeControl: false
				});

				var marker = new google.maps.Marker({
					position: {lat: 52.056924, lng: -9.50974},
					map: map,
					title: "Festival Location"
				});
			};

		}

	})();

})();
