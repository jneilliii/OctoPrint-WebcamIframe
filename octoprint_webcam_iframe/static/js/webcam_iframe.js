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

		self.onAllBound = function(allViewModels){
			$('#webcam_container').replaceWith('<iframe id="webcam_container" src="abount:blank" width="588" height="330" style="border: none;"></iframe>');
		}

		self.onTabChange = function(current, previous) {
				if (current === "#control") {
					$('#webcam_container').attr("src", self.settingsViewModel.webcam_streamUrl());
				}
				if (previous === "#control") {
					$('#webcam_container').attr("src", "about:blank");
				}
			};

		self.controlViewModel.onBrowserTabVisibilityChange = function(status) {
			if (status) {
				self.controlViewModel._enableWebcam();
				$('#webcam_container').attr("src", self.settingsViewModel.webcam_streamUrl());
			} else {
				$('#webcam_container').attr("src", "about:blank");
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
