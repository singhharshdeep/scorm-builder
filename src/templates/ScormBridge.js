// This script will be bundled into the ZIP as 'scorm-bridge.js'
var ScormBridge = (function () {
  var api = null;

  function findAPI(win) {
    var attempts = 0;
    while (
      win.API == null &&
      win.parent != null &&
      win.parent != win &&
      attempts < 10
    ) {
      win = win.parent;
      attempts++;
    }
    return win.API;
  }

  return {
    init: function () {
      api = findAPI(window) || (window.opener ? findAPI(window.opener) : null);
      if (api) {
        api.LMSInitialize("");
        api.LMSSetValue("cmi.core.lesson_status", "incomplete");
        api.LMSCommit("");
        console.log("SCORM: Initialized and Connected");
      }
    },
    finish: function () {
      if (api) {
        api.LMSFinish("LMS Set: cmi.core.lesson_status -> completed");
      }
    },
    setComplete: function (score) {
      if (api) {
        if (score !== undefined)
          api.LMSSetValue("cmi.core.score.raw", score.toString());
        api.LMSSetValue("cmi.core.lesson_status", "completed");
        api.LMSCommit("");
      }
    },
    saveBookmark: function (index) {
      if (api) {
        api.LMSSetValue("cmi.suspend_data", index.toString());
        api.LMSCommit("");
      }
    },
    getBookmark: function () {
      return api ? api.LMSGetValue("cmi.suspend_data") : null;
    },
  };
})();
