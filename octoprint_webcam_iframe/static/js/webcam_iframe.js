/*
 * View model for OctoPrint-WebcamIframe
 *
 * Author: jneilliii
 * License: AGPLv3
 */
$(function() {
	function Webcam_iframeViewModel(parameters) {
		var self = this;

		self.settingsViewModel = parameters[0];
		self.controlViewModel = parameters[1];
		self.currentTab = "";

		self.timerHideIframe = null;
		self.timerHidePluginDashboardIframe = null;

		self.onAllBound = function(allViewModels){
			$('#webcam_container, #classicwebcam_container').replaceWith('<iframe id="webcam_container" src="about:blank" width="588" height="330" style="border: none;" allow="autoplay *; fullscreen *"></iframe>');
		}

		self.onTabChange = function(current, previous) {
				var iframeTimeout = self.settingsViewModel.webcam_streamTimeout();

				if (current !== null) self.currentTab = current;  // Don't update current tab variable so we can simulate switch back

				if (current === "#control") {
					clearInterval(self.timerHideIframe);
					if ($('#webcam_container').attr("src") != self.settingsViewModel.webcam_streamUrl()) {
						$('#webcam_container').attr("src", self.settingsViewModel.webcam_streamUrl());
					}
				}
				if (previous === "#control") {
					clearInterval(self.timerHideIframe);
					self.timerHideIframe = setTimeout(function() {
						$('#webcam_container').attr("src", "about:blank");
					}, iframeTimeout * 1000);
				}

				// Dashboard plugin
				if (current === "#tab_plugin_dashboard") {
					var dashboard_webcam = $('#plugin_dashboard_webcam_container');
					if (dashboard_webcam.length == 0) {  // We have to do it here, because dashboard_webcam_image object not exists yet when onAllBound triggered
						dashboard_webcam = $('<iframe id="plugin_dashboard_webcam_container" src="about:blank" width="100%" height="100%" style="border: none;" allow="autoplay *; fullscreen *"></iframe>');
						$("#dashboard_webcam_image").replaceWith(dashboard_webcam);
					}
					clearInterval(self.timerHidePluginDashboardIframe);
					if (dashboard_webcam.attr("src") != self.settingsViewModel.webcam_streamUrl()) {
						dashboard_webcam.attr("src", self.settingsViewModel.webcam_streamUrl());
					}
				}
				if (previous === "#tab_plugin_dashboard") {
					clearInterval(self.timerHidePluginDashboardIframe);
					self.timerHidePluginDashboardIframe = setTimeout(function() {
						$('#plugin_dashboard_webcam_container').attr("src", "about:blank");
					}, iframeTimeout * 1000);
				}
			};

		self.controlViewModel.onBrowserTabVisibilityChange = function(status) {
            if (VERSION.split(".")[1] < 9) {
                if (status) {
                    self.controlViewModel._enableWebcam();
                    self.onTabChange(self.currentTab, null);  // Simulate change to current tab
                } else {
                    self.onTabChange(null, self.currentTab);  // Simulate change from current tab
                    self.controlViewModel._disableWebcam();
                }
            }
		};
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: Webcam_iframeViewModel,
		dependencies: ["settingsViewModel", "controlViewModel"],
		elements: [ /* ... */ ]
	});
});
