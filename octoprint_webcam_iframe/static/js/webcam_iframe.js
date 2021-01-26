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

		self.onAllBound = function(allViewModels){
			$('#webcam_container').replaceWith('<iframe id="webcam_container" src="about:blank" width="588" height="330" style="border: none;" allow="autoplay *; fullscreen *"></iframe>');
		}

		self.onTabChange = function(current, previous) {
				if (current !== null) self.currentTab = current;  // Don't update current tab variable so we can simulate switch back
            
				if (current === "#control") {
					$('#webcam_container').attr("src", self.settingsViewModel.webcam_streamUrl());
				}
				if (previous === "#control") {
					$('#webcam_container').attr("src", "about:blank");
				}
            
				// Dashboard plugin
				if (current === "#tab_plugin_dashboard") {
					var dashboard_webcam = $('#plugin_dashboard_webcam_container');
					if (dashboard_webcam.length == 0) {  // We have to do it here, because dashboard_webcam_image object not exists yet when onAllBound triggered
						dashboard_webcam = $('<iframe id="plugin_dashboard_webcam_container" src="about:blank" width="100%" height="100%" style="border: none;" allow="autoplay *; fullscreen *"></iframe>');
						$("#dashboard_webcam_image").replaceWith(dashboard_webcam);
					}

					dashboard_webcam.attr("src", self.settingsViewModel.webcam_streamUrl());
				}
				if (previous === "#tab_plugin_dashboard") {
					$('#plugin_dashboard_webcam_container').attr("src", "about:blank");
				}
			};

		self.controlViewModel.onBrowserTabVisibilityChange = function(status) {
			if (status) {
				self.controlViewModel._enableWebcam();
				self.onTabChange(self.currentTab, null);  // Simulate change to current tab
			} else {
				self.onTabChange(null, self.currentTab);  // Simulate change from current tab
				self.controlViewModel._disableWebcam();
			}
		};
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: Webcam_iframeViewModel,
		dependencies: ["settingsViewModel", "controlViewModel"],
		elements: [ /* ... */ ]
	});
});
