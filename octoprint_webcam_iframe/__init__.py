# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin

class Webcam_iframePlugin(octoprint.plugin.SettingsPlugin,
                          octoprint.plugin.AssetPlugin,
                          octoprint.plugin.TemplatePlugin):

	##~~ AssetPlugin mixin

	def get_assets(self):
		return dict(
			js=["js/webcam_iframe.js"]
		)

	##~~ Softwareupdate hook

	def get_update_information(self):
		return dict(
			webcam_iframe=dict(
				displayName="Webcam Iframe",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="jneilliii",
				repo="OctoPrint-WebcamIframe",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/jneilliii/OctoPrint-WebcamIframe/archive/{target_version}.zip"
			)
		)

__plugin_name__ = "Webcam Iframe"
__plugin_pythoncompat__ = ">=2.7,<4"

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = Webcam_iframePlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}

