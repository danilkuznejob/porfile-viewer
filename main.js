var s = chrome.storage.local;
var sm = chrome.runtime.sendMessage;
var link = $("div.bd>h3").find("a[href*='www.linkedin.com/profile/']");
var linkedIn = "http://www.linkedin.com";
//var logFile = "log.txt"
var log = "";

s.get(["eq", "lastUrl", "keywords", "titles", "industries", "postalcodes", "radius", "posPostalCode", "startTime", "endTime", "log"], function (i) {

	// Check current hour against startTime and endTime
	var objDate = new Date();
	var hours = objDate.getHours();

//	logFile = i.logFile;
	log = i.log;

//alert("Current Hour: " + hours + " Business Hours: " + i.startTime + " to " + i.endTime);

	if(hours >= i.startTime && hours < i.endTime){

//alert("Business Open!");
	    var eq = i.eq;
	    if (!eq) {
	        eq = 0;
	    }

		//sometimes first link of new page same as last one of last page, ignore
		if (eq < link.length) {
			var href = link.eq(eq).attr("href");
			if (eq == 0 && i.lastUrl) {
				if (href == i.lastUrl) {
					eq += 1;
				}
			}
			if (eq < link.length - 1) {
				openLink(href);
				s.set({eq: eq + 1}, function () {
				});
			} else {
				// reach end of the page, ready to open next page
				openLink(href);
				var next = $("li.active").next().find("a").attr("href");
				// have more page
				if (next && next.length > 0) {
					window.open(linkedIn + next, "_self");
log = log + new Date().toString() + "|Next Page|" + linkedIn + next + "\r\n";
s.set({log: log}, function () {
});
				} else {
					profileSearch(i);

					// no more results, stop
//					sm({method: "stop"}, function () {
//					});
				}
				s.set({eq: 0, lastUrl: href}, function () {
				});
			}
		} else {
			// Do profile search
			profileSearch(i);
		}
	} else {
//alert("Business Closed!");
	}
});

function openLink(url) {
    if (url.indexOf("http") != 0 && url.indexOf("https") != 0){
        url = linkedIn + url;
    }

//	alert("Profile View: " + url);
//writeActionLog(logFile, "Profile View: " + url + "\r\n");
log = log + new Date().toString() + "|Profile View|" + url + "\r\n";
s.set({log: log}, function () {
});
    sm({method: "open", plink: url}, function () {
    });
}

function profileSearch(i) {
	var posPostalCode = i.posPostalCode;
	var postalcodes = i.postalcodes.split(',');
    if (!posPostalCode) {
       	posPostalCode = 0;
    }

	if (posPostalCode < postalcodes.length) {
		var keywords = i.keywords;
		var titles = i.titles;
		var radius = i.radius;
		var industries = i.industries;

		var searchUrl = "https://www.linkedin.com/vsearch/p?";
		searchUrl = searchUrl + "keywords=" + keywords + "&";
		searchUrl = searchUrl + "title=" + titles + "&";
		searchUrl = searchUrl + "postalCode=" + postalcodes[posPostalCode].trim() + "&";
		searchUrl = searchUrl + "distance=" + radius + "&";
		searchUrl = searchUrl + "titleScope=CP&locationType=I&";
		searchUrl = searchUrl + "countryCode=us&";
		searchUrl = searchUrl + "f_I=" + industries; //47,94,120

//		chrome.tabs.update(tabId, {url: searchUrl});
		window.open(searchUrl, "_self");

//		alert("New Search: " + searchUrl);
//writeActionLog(logFile, "New Search: " + searchUrl + "\r\n");
log = log + new Date().toString() + "|New Search|" + searchUrl + "\r\n";
s.set({log: log}, function () {
});

		s.set({posPostalCode: posPostalCode + 1}, function () {
		});
    } else {
    	// no more postal code, stop
log = log + new Date().toString() + "|All Search Completed| \r\n";
s.set({log: log}, function () {
});
		sm({method: "stop"}, function () {
		});
    	alert("All search completed.");
    }
}

/*function writeActionLog(logFile, message) {
var reader = new FileReader();
var viewerLog = reader.readAsText(logFile);
viewerLog = viewerLog + message;
alert (viewerLog);

    logfile.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = callback;

    logFile.file(function(file) {
      writer.write(viewerLog);
    });
  }, errorHandler);
}*/