$(document).ready(function () {
    if (!localStorage.min) {
        localStorage.min = "2";
    }
    if (!localStorage.max) {
        localStorage.max = "5";
    }

    $("#min").val(localStorage.min);
    $("#max").val(localStorage.max);
    $("#keywords").val(localStorage.keywords);
    $("#titles").val(localStorage.titles);
    $("#industries").val(localStorage.industries);
    $("#postalCodes").val(localStorage.postalcodes);
    $("#radius").val(localStorage.radius);
    $("#startTime").val(localStorage.startTime);
    $("#endTime").val(localStorage.endTime);
chrome.storage.local.get(["log"], function (i) {
    $("#log").val(i.log);
});

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var startButton = $("#start");
        var stopButton = $("#stop");
//        var statusLabel = $("#status");
        var saveButton = $("#save");
        if (!localStorage.status) {
            localStorage.status = "stop"
        }

        if (localStorage.status == "running") {
            startButton.attr("disabled", "disabled");
        } else {
            stopButton.attr("disabled", "disabled");
            saveButton.attr("disabled", "disabled");
        }
        startButton.click(function () {
            var min = $("#min").val().trim();
            var max = $("#max").val().trim();
            var keywords = $("#keywords").val().trim();
            var titles = $("#titles").val().trim();
            var industries = $("#industries").val().trim();
            var postalcodes = $("#postalCodes").val().trim();            
            var radius = $("#radius").val().trim();            
            var startTime = $("#startTime").val().trim();
            var endTime = $("#endTime").val().trim();
            if (validInt(min, max)) {
                localStorage.status = "running";
                localStorage.min = min;
                localStorage.max = max;
                localStorage.keywords = keywords;
                localStorage.titles = titles;
                localStorage.industries = industries;
                localStorage.postalcodes = postalcodes;
                localStorage.radius = radius;
                localStorage.startTime = startTime;
                localStorage.endTime = endTime;

                chrome.storage.local.set({runStat: true, min: parseInt(min), max: parseInt(max), keywords: keywords, titles: titles, industries: industries, postalcodes: postalcodes, radius: radius, posPostalCode: 0, startTime: parseInt(startTime), endTime: parseInt(endTime), tabId: tabs[0].id}, function () {
                });
                chrome.runtime.sendMessage({method: "start"}, function () {
                });
//                statusLabel.text("current status  " + localStorage.status);
                startButton.attr("disabled", "disabled");
                stopButton.removeAttr("disabled");
                saveButton.removeAttr("disabled");

            } else {
                alert("set the correct delay minute or start and end time please");
            }
        });
        stopButton.click(function () {
            localStorage.status = "stop";
            chrome.alarms.clearAll();
            chrome.storage.local.set({runStat: false}, function () {
            });
            chrome.runtime.sendMessage({method: "stop"}, function () {
            });
//            statusLabel.text("current status  " + localStorage.status);
            startButton.removeAttr("disabled");
            stopButton.attr("disabled", "disabled");
        });
    });

    function validInt(min, max) {
        var reg = /^\+?[1-9][0-9]*$/;
        if (!reg.test(min) || !reg.test(max)) {
            return false;
        }
        if (min > max) {
            return false;
        } else return !(!min || !max);
    }
});