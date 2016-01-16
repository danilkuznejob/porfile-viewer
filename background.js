var s = chrome.storage.local;
var t = chrome.tabs;
var om = chrome.runtime.onMessage;
var a = chrome.alarms;
var log = "";

om.addListener(function (req, sender, sendResponse) {
	
    var method = req.method;
    if (method == "start") {
        s.get(["min", "max", "tabId"], function (i) {
            var min = i.min;
            var max = i.max;
            localStorage.tabId = i.tabId;
log = new Date().toString() + "|Start Button| \r\n";
/*displayPath(logFile);
    logFile.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.write(new Blob(['Started: ' + logFile], {type: 'text/plain'}));
    }, errorHandler);*/
s.set({log: log}, function () {
});			console.log(i.tabId+'  '+min+'   '+max);
            inject(i.tabId, min, max);
        });
    }
    if (method == "open") {
        var plink = req.plink;
        t.create({url: plink}, function (tab) {
            localStorage.newTabId = tab.id;
        });
    }
    if (method == "stop") {
        a.clearAll();
        localStorage.status = "stop";
        s.set({eq: 0, log: ''}, function () {
        });
    }
});

a.onAlarm.addListener(function (alarm) {
    //t.remove(parseInt(localStorage.newTabId), function () {
    //});
	t.remove(parseInt(localStorage.tabId), function () {
    });
    inject(parseInt(localStorage.tabId), parseInt(localStorage.min), parseInt(localStorage.max));
});

function inject(tabId, min, max) {
	console.log(tabId);
    t.executeScript(tabId, {file: "jquery-2.0.3.min.js"}, function () {
        t.executeScript(tabId, {file: "main.js"}, function () {
            a.create("openProfile", {periodInMinutes: randomIntFromInterval(min, max)});
        });
    });
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// if main tab closed, clear all the info
t.onRemoved.addListener(function (tabId, info) {
    if (tabId == parseInt(localStorage.tabId)) {
        a.clearAll();
        localStorage.status = "stop";
        s.set({eq: 0}, function () {
        });
    }

/*function displayPath(fileEntry) {
  chrome.fileSystem.getDisplayPath(fileEntry, function(path) {
    alert(path);
  });
}*/

});
