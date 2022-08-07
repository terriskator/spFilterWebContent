// ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.live.js,v 1.25 2018/01/20 11:15:33 user Exp $ **** 
//

/**
 ** Falls der Anwender auf das Icon der Extension geklickt hat,
 ** laeuft dieses js-script in der Webseite, die die Extension dann anzeigt
 **
 ** Die Datei
 **     spFilterWebContent.live.html
 ** enthaelt:
 **     <script src="spFilterWebContent.live.js"></script>
 **
 ** Diese Implementierung ist nicht schoen. Besser waere nur
 ** ein script im background, das die Ausgabe in der Webseite uebernimmt.
 ** Da das background-script aber nicht auf das DOM der Webseite
 ** zugreifen kann, waere ein Austausch ueber Nachrichten notwendig
 ** 
 **/

"use strict";
 
// Der Name des Moduls (u.a. fuer die Hilfsfunktion sp_printDebugLogMessage())
var SPMODULENAME = 'spFilterWebContentConsole';

// eine globale Variable, die die eigene Tab-ID notiert
var myOwnTabId;

// eine globale Variable, die den Index der Regel fuer Schriftgroesse und -family notiert
var myOwnCSSRuleIndex = -1;

// eine globale Variable, die die Werte der Optionen enthaelt
// ================================================================================================================================
// **** START OF : $Id: vardef.js,v 1.36 2020/03/28 11:06:10 user Exp $ **** 
//

/*
 * Die Liste der moeglichen Resource-Types, die Firefox anfordern kann, ist hier dokumentiert:
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest/ResourceType
 *
 * Die Liste der moeglichen Resource-Types, die Chrome anfordern kann, ist hier dokumentiert:
 * https://developer.chrome.com/extensions/webRequest#type-ResourceType
 *
 *
 * Stand 02-Dec-2017:
 * FF     "beacon"            : Requests sent through the Beacon API.
 * FF CH  "csp_report"        : Requests sent to the report-uri given in the Content-Security-Policy header, when an attempt to violate the policy is detected.
 * FF CH  "font"              : Web fonts loaded for a @font-face CSS rule.
 * FF CH  "image"             : Resources loaded to be rendered as image, except for imageset on browsers that support that type (see browser compatibility below).
 * FF     "imageset"          : images loaded by a <picture> element or given in an <img> element's srcset attribute.
 * FF CH  "main_frame"        : Top-level documents loaded into a tab.
 * FF CH  "media"             : Resources loaded by a  <video> or  <audio> element.
 * FF CH  "object"            : Resources loaded by an <object> or <embed> element. Browsers that don't have a dedicated object_subrequest type, also label subsequent requests sent by the plugin as object.
 * FF     "object_subrequest" : Requests sent by plugins.
 * FF CH  "ping"              : Requests sent to the URL given in a hyperlink's ping attribute, when the hyperlink is followed.
 * FF CH  "script"            : Code that is loaded to be executed by a <script> element or running in a Worker.
 * FF CH  "stylesheet"        : CSS stylesheets loaded to describe the representation of a document
 * FF CH  "sub_frame"         : Documents loaded into an <iframe> or <frame> element.
 * FF     "web_manifest"      : Web App Manifests loaded for websites that can be installed to the homescreen.
 * FF CH  "websocket"         : Requests initiating a connection to a server through the WebSocket API.
 * FF     "xbl"               : XBL bindings loaded to extend the behavior of elements in a document.
 * FF     "xml_dtd"           : DTDs loaded for an XML document.
 * FF CH  "xmlhttprequest"    : Requests sent by an XMLHttpRequest object or through the Fetch API.
 * FF     "xslt"              : XSLT stylesheets loaded for transforming an XML document. Browsers that don't have a dedicated beacon type, also label requests sent through the Beacon API as ping.
 * FF CH  "other" : Resources that aren't covered by any other available type.
 */


/*
 * Die globale Variable ist ein Javascript-Object, das fuer jeden von der Webextension
 * beruecksichtigen ResourceType festhaelt, welche URLs nicht erlaubt sein sollen
 * Die Namen der Attribute muessen identisch sein mit den die IDs der Felder in
 * Option-Seite spFilterWebContent.options.html
 */

// Globale Variable, die die Optionen enthält
var myOptionsStorage = {
    myOptionBlockAllURL:"",
    myOptionBlock_beacon_URL:"",
    myOptionBlock_csp_report_URL:"",
    myOptionBlock_font_URL:"",
    myOptionBlock_font_Name:"",
    myOptionBlock_image_URL:"",
    myOptionBlock_imageset_URL:"",
    myOptionBlock_main_frame_URL:"",
    myOptionBlock_media_URL:"",
    myOptionBlock_object_URL:"",
    myOptionBlock_object_subrequest_URL:"",
    myOptionBlock_ping_URL:"",
    myOptionBlock_script_URL:"",
    myOptionBlock_stylesheet_URL:"",
    myOptionBlock_sub_frame_URL:"",
    myOptionBlock_web_manifest_URL:"",
    myOptionBlock_websocket_URL:"",
    myOptionBlock_xbl_URL:"",
    myOptionBlock_xml_dtd_URL:"",
    myOptionBlock_xmlhttprequest_URL:"",
    myOptionBlock_xslt_URL:"",
    myOptionBlock_other_URL:"",
    
    myOptionAllowAllURL:"",
    myOptionAllow_beacon_URL:"",
    myOptionAllow_csp_report_URL:"",
    myOptionAllow_font_URL:"",
    myOptionAllow_image_URL:"",
    myOptionAllow_imageset_URL:"",
    myOptionAllow_main_frame_URL:"",
    myOptionAllow_media_URL:"",
    myOptionAllow_object_URL:"",
    myOptionAllow_object_subrequest_URL:"",
    myOptionAllow_ping_URL:"",
    myOptionAllow_script_URL:"",
    myOptionAllow_stylesheet_URL:"",
    myOptionAllow_sub_frame_URL:"",
    myOptionAllow_web_manifest_URL:"",
    myOptionAllow_websocket_URL:"",
    myOptionAllow_xbl_URL:"",
    myOptionAllow_xml_dtd_URL:"",
    myOptionAllow_xmlhttprequest_URL:"",
    myOptionAllow_xslt_URL:"",
    myOptionAllow_other_URL:"",
    
    myOptionAllowRefererURL:"",
    myOptionAllowCookiesURL:"",
    myOptionAllowCookiesResponseURL:"",

    myOptionBlockRefererURL:"",
    myOptionBlockCookiesURL:"",
    myOptionBlockCookiesResponseURL:"",
    myOptionChangeUserAgentURL:"",
    myOptionChangeUserAgent:"",
    myOptionChangeUserAgentSavedValues:"",
    
    myOptionChangeUserAgentStandardValues:"Firefox 63 Win7 32Bit   : Mozilla/5.0 (Windows NT 6.1; rv:63.0) Gecko/20100101 Firefox/63.0\nFirefox 63 Win7 64Bit   : Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0\nFirefox 74 Win10 64Bit  : Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0\nFirefox 63 Linux 64Bit  : Mozilla/5.0 (X11; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0\nFirefox 63 Android 7    : Mozilla/5.0 (Android 7.1.1; Tablet; rv:63.0) Gecko/63.0 Firefox/63.0\nChrome 80 Win10 64Bit   : Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36\nChromium 71 Linux 64Bit : Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/71.0.3578.80 Chrome/71.0.3578.80 Safari/537.36\nIE11 Win7  32Bit        : Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko\nIE11 Win7  64Bit        : Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko\nIE11 Win10 64Bit        : Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko\nEdge Win10-1703 64Bit   : Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063\nEdge Win10-1803 64Bit   : Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763\nEdge Chromium Win 64Bit : Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 Edg/80.0.361.66\nSafari iOS  9.3.5       : Mozilla/5.0 (iPad; CPU OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G36 Safari/601.1\nSafari iOS 10.3.3       : Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1\nSafari iOS 12.1         : Mozilla/5.0 (iPad; CPU OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1\nSafari MacOSX 10.11.6   : Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_16) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7\nSafari MacOSX 10.13.3   : Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6",
    myOptionShowRequestHeaders:"cookie/referer",
    myOptionShowResponseHeaders:"cookie/server/content-security/content-type/content-length/last-modified",
    myOptionFontFamily:"sans-serif",
    myOptionFontSize:"medium",
    myOptionShowDataRequest:"short",
    myOptionSuppressAllURL:"",
    myOptionRedirectAllURL:"",
    myOptionNoCSPHeaderURL:"",
    myOptionSetCSPHeaderURL:"",
    myOptionShowFormDataURL:"",
    myOptionSecureURL:"",
    myOptionNoHeaderURL:"",
    myOptionMaxFormBytes:"1024",
    myOptionMaxHeaderBytes:"1024"
};

function myOptionsStorage_CreateKey_Block_URL(resourcetype)
{
    return( "myOptionBlock_" + resourcetype.toLowerCase() + "_URL" );
}
function myOptionsStorage_CreateKey_Allow_URL(resourcetype)
{
    return( "myOptionAllow_" + resourcetype.toLowerCase() + "_URL" );
}

function myOptionsStorage_CreateKey_Block_NAME(resourcetype)
{
    return( "myOptionBlock_" + resourcetype.toLowerCase() + "_Name" );
}

//
// Funktion um zu pruefen, ob die Konfiguration sicher ist
//
function myOptionsStorage_CheckConfigurationSecurity()
{
    var myoptionstestarray = [ {key : "myOptionBlock_script_URL", text : "SCRIPT blocked for /"},
			       {key : "myOptionBlockRefererURL", text : "Referer deleted for /"},
			       {key : "myOptionBlockCookiesURL", text : "Cookies deleted in Request Headers for /"},
			       {key : "myOptionBlockCookiesResponseURL", text : "Cookies deleted in Response Headers for /"}, 
			       {key : "myOptionBlock_csp_report_URL", text : "CSP report URLs blocked for /"},
			       {key : "myOptionSetCSPHeaderURL" , text : "CSP header set for / with option script-src 'none'" } ];
    var i;
    
    var is_secure=true;
    var testval;
    var do_print_details = false;
    var myspan = undefined;
    var mytable = undefined;
    // Die Ausgabe in der Optionsseite vorbereiten, sofern diese vorhanden ist
    var myspan = document.getElementById("sp_Security_Status");
    if ( myspan != undefined ) {
	
	do_print_details = true;
	
        while (myspan.firstChild)
	    myspan.removeChild(myspan.firstChild);
	var myheader = document.createElement("H1");
	myheader.appendChild(document.createTextNode("Security Assessment"));
	myspan.appendChild(myheader);
	mytable = document.createElement("TABLE");
	mytable.style.fontSize="100%";
	myspan.appendChild(mytable);
	
    }

    // Die Optionen durchgehen
    for (i=0; i<myoptionstestarray.length;i++) {

	// Option testen auf /
	testval = sp_CheckOptionExactMatchValue(myoptionstestarray[i].key,"/")
	// Sondertest bei SetCSPHeader auf Inhalt des Wertes
	if ( (testval.value == true) && (myoptionstestarray[i].key == "myOptionSetCSPHeaderURL") ) {
	    if ( testval.option_value.indexOf("script-src 'none'") < 0 )
		testval.value = false;
	}

	// Falls Einzeltest negativ, dann ist das ganze Ergebnis negativ
	if ( testval.value == false )
	    is_secure=false;

	// Ausgabe, sofern gewuenscht
	if ( do_print_details == true ) {
	    var myrow = mytable.insertRow();
	    var mycell1 = myrow.insertCell(0);
	    var mycell2 = myrow.insertCell(1);
	    
	    mycell1.appendChild(document.createTextNode(myoptionstestarray[i].text));
	    if ( testval.value == false ) {
		myrow.style.background = "#fff0f0"
		mycell2.appendChild(document.createTextNode("NO"));
	    }	    
	    else {
		myrow.style.background = "#f0fff0"
		mycell2.appendChild(document.createTextNode("YES"));
	    }
	} // if ( do_print_details == true ) {
    } // for (i=0; i<myoptionstestarray.length;i++) {

    // Ausgabe des Gesamtergebnisses, sofern gewuenscht
    if ( do_print_details == true ) {
	var myrow = mytable.insertRow();
	var mycell1 = myrow.insertCell(0);
	
	myrow = mytable.insertRow();
	mycell1 = myrow.insertCell(0);
	if ( is_secure == true ) {
	    mycell1.appendChild(document.createTextNode("High security configuration is active."));
	}
	else {
	    mycell1.appendChild(document.createTextNode("High security configuration is not active."));
	}
    }


    // Aendern des Logos in der Brower Action, sofern dies moeglich ist
    // Firefox mit Android zeigt kein Logo an.
    if ( "setIcon" in browser.browserAction ) {
	if ( is_secure == true ) {
	    browser.browserAction.setIcon({path: {16: "spFilterWebContent.secure.logo.016.png",
						  32: "spFilterWebContent.secure.logo.032.png",
						  64: "spFilterWebContent.secure.logo.064.png"}});
	}
	else {
	    browser.browserAction.setIcon({path: {16: "spFilterWebContent.logo.016.png",
						  32: "spFilterWebContent.logo.032.png",
						  64: "spFilterWebContent.logo.064.png"}});
	}
    }
    
    return is_secure;
}

//
// **** END OF : $Id: vardef.js,v 1.36 2020/03/28 11:06:10 user Exp $ **** 
// ================================================================================================================================


// Die globale Variable mit den gespeicherten Werten vorbelegen
// und einen Listener registrieren, damit Aenderungen, die in der Option-Seite
// vorgenommen werden, bemerkt werden.
LoadOptions();
listenToStorageChanges();

/*
 * Listener fuer die verschiedenen Vorfaelle bei WebRequests registrieren,
 * um die Daten anzeigen zu koennen
 *
 * Fuer 
 *   OnBeforeSendHeaders
 * gibt es keinen Listner. Fuer die Ausgabe in der WebConsole interessiert nur 
 *   OnSendHeaders
 */

// Firefox52esr kennt OnAuthRequired nicht, daher den Listener nur registrieren, wenn das script nicht in Firefox52 laeuft 
if ( navigator.userAgent.indexOf("Firefox/52.") < 0 )
    spAdd_OnAuthRequired_Listener_Report();

spAdd_OnBeforeRedirect_Listener_Report();
spAdd_OnBeforeRequest_Listener_Report();
spAdd_OnCompleted_Listener_Report();
spAdd_OnErrorOccurred_Listener_Report();
spAdd_OnSendHeaders_Listener_Report();

//
// Die Ueberschrift anpassen, eigene Tab-ID notieren
// und die anderen Tabs beanrichtigen, dass sie sich auf inaktiv setzen sollen
//
{
// ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.live.js__GetCurrentTab.js,v 1.1 2017/08/24 10:39:04 user Exp $ **** 
//

// Implementierung fuer Firefox
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/getCurrent

var gettingCurrent = browser.tabs.getCurrent();
gettingCurrent.then(spOnGotTabCurrent, spOnErrorTabCurrent);

//
// **** END OF   : $Id: spFilterWebContent.live.js__GetCurrentTab.js,v 1.1 2017/08/24 10:39:04 user Exp $ **** 
// ================================================================================================================================

    
    function spOnGotTabCurrent(tabInfo) {

	// eigene tab-id notieren
	myOwnTabId = tabInfo.id;

	// Titel des tab anpassen
	sp_printDebugLogMessage("document.title = spConsole" + myOwnTabId);
	document.title = "spConsole" + myOwnTabId + " [active]";

	// Nachricht verschicken und Ergebnis ignorieren
	browser.runtime.sendMessage( { msgtype : "spWebConsoleStart", tabid: tabInfo.id} );

    }
    
    function spOnErrorTabCurrent(error) {
	sp_printDebugLogMessage(error);
    }
}

//
// Einen Listener registrieren, um auf Nachrichten reagieren zu koennen
//
browser.runtime.onMessage.addListener(handleMessage);
function handleMessage(request, sender, sendResponse) {

    sp_printDebugLogMessage("handleMessage() : START");
    sp_printDebugLogMessage("handleMessage() : myOwnTabId ==" + myOwnTabId );
    
    sp_printDebugLogObject("handleMessage.request",request);
    //sp_printDebugLogObject("handleMessage.sender",sender);

    // Falls eine Nachricht im erwarteten Format ist ...
    if ( request["msgtype"] != undefined ) {
	
	if ( request["msgtype"] == "spWebConsoleStart" ) {

	    // Falls es eine Nachricht mit einer Tab-ID ist, so stammt diese von einem anderen Tab
	    // in dem ein live script laeuft. Dieser Tab will nun die alleinige aktive Console sein
	    // Alle bereits laufenden Consolen sollen sich auf inaktiv stellen
	    // 
	    if ( myOwnTabId != request["tabid"] ) {
		sp_printDebugLogMessage("handleMessage() : tabid      == " + request["tabid"]);
		sp_printDebugLogMessage("handleMessage() : myOwnTabId == " + myOwnTabId);
		sp_DisableCurrentTab();
	    }
	}
	
	// Falls es eine Nachricht mit einer Erluabnis- oder Blockiermeldung ist, diese anzeigen
	else {
	    
	    if ( request["msgtype"] == "spBlockedReport" ) {
		
		// Meldung, dass die Nachricht empfangen wurde
		sendResponse({response: "ok"});

		// Die Meldung anzeigen
		var mydiv_id = sp_CreateDivID(request["RequestId"]);
		sp_printDebugLogMessage("handleMessage() : mydiv_id == " + mydiv_id);
		if ( document.getElementById(mydiv_id) != null ) {
		    var span = document.createElement('span');
		    span.className="spMessage" + request["type"]  + "Blocked";
		    
		    //span.innerHTML = "<br>" + sp_CurrentDate2String() + "<b> " + mytypeU + " BLOCKED: </b> URL key=<b>" + my_value_array[i] + "</b>";
		    span.appendChild(document.createElement("BR"));
		    span.appendChild(document.createTextNode(sp_CurrentDate2String() + " "));
		    var b1 = document.createElement("B");
		    b1.appendChild(document.createTextNode(request["part01"]));
		    span.appendChild(b1);
		    span.appendChild(document.createTextNode(request["part02"]));
		    var b2 = document.createElement("B");
		    b2.appendChild(document.createTextNode(request["part03"]));
		    span.appendChild(b2);
		    
		    document.getElementById(mydiv_id).appendChild(span);

		    
		} // if ( document.getElementById(mydiv_id) != null )
	    } // if ( request["msgtype"] == "spBlockedReport" ) {

	    if ( request["msgtype"] == "spAllowedReport" ) {
    
		// Meldung, dass die Nachricht empfangen wurde
		sendResponse({response: "ok"});

		// Die Meldung anzeigen
		var mydiv_id = sp_CreateDivID(request["RequestId"]);
		sp_printDebugLogMessage("handleMessage() : mydiv_id == " + mydiv_id);
		if ( document.getElementById(mydiv_id) != null ) {
		    var span = document.createElement('span');
		    span.className="spMessage" + request["type"]  + "Allowed";
		    
		    //span.innerHTML = "<br>" + sp_CurrentDate2String() + "<b> " + mytypeU + " ALLOWED: </b> URL key=<b>" + my_value_array[i] + "</b>";
		    span.appendChild(document.createElement("BR"));
		    span.appendChild(document.createTextNode(sp_CurrentDate2String() + " "));
		    var b1 = document.createElement("B");
		    b1.appendChild(document.createTextNode(request["part01"]));
		    span.appendChild(b1);
		    span.appendChild(document.createTextNode(request["part02"]));
		    var b2 = document.createElement("B");
		    b2.appendChild(document.createTextNode(request["part03"]));
		    span.appendChild(b2);
		    
		    document.getElementById(mydiv_id).appendChild(span);

		    
		} // if ( document.getElementById(mydiv_id) != null )
	    } // if ( request["msgtype"] == "spBlockedReport" ) {




	    
	}  //  else

	
	
    } // if ( request["msgtype"] != undefined ) {
    
    sp_printDebugLogMessage("handleMessage() : END");
}

/*
 * ==================================================================================================================
 *
 * Definition von Funktionen
 */

function sp_DisableCurrentTab() {

    sp_printDebugLogMessage("sp_DisableCurrentTab() START");
    
    // Die weitere Anzeige unterbinden
    var mytable = document.getElementById("myExplanationTable");
    mytable.parentNode.removeChild(mytable);
    
    spRemove_OnAuthRequired_Listener_Report();
    spRemove_OnBeforeRedirect_Listener_Report();
    spRemove_OnBeforeRequest_Listener_Report();
    spRemove_OnCompleted_Listener_Report();
    spRemove_OnErrorOccurred_Listener_Report();
    spRemove_OnSendHeaders_Listener_Report();
    
    document.title = "spConsole" + myOwnTabId + " [passive]";

    browser.runtime.onMessage.removeListener(handleMessage);

    document.body.style.backgroundColor = "lightgrey";

    sp_printDebugLogMessage("sp_DisableCurrentTab() END");

}

// Hilfsfunktion, um in der HTML-Seite die IDs der DIV, in denen die Meldungen erscheinen, zu erzeugen
function sp_CreateDivID(myid) 
{
    return( "sp__" + myid);
}

// ================================================================================================================================
// **** START OF : $Id: function_utils.js,v 1.6 2018/01/20 11:15:33 user Exp $ **** 
//


/*
 * Hilfsfunktion, um den Wert einer Option zu ermitteln
 * mykey == der Name der Option
 * myurl == der Name der URL fuer die geprueft wird, ob eine Option hinterlegt ist.
 */
function sp_CheckOptionMatch(mykey, myurl)
{
    var my_value_array;
    var i;
    
    // Wenn der Anwender Werte fuer die Option hinterlegt hat ...
    if ( (myOptionsStorage[mykey] != undefined) && (myOptionsStorage[mykey].length > 0) ) {

	// ... Den Wert in seine Bestandteile zerlegen ...
	my_value_array = myOptionsStorage[mykey].split("\n");
	
	// ... die Bestandteile nacheinander testen ...
	for (i=0; i< my_value_array.length; i++) {
	    // ... wenn der Bestandteil irgendwo in der URL vorkommt ...
	    if ( myurl.indexOf(my_value_array[i]) >= 0 ) {
		return {value : true, matched_string : my_value_array[i] };
	    }
	}
    }
    
    return {value : false};
}

function sp_CheckOptionExactMatch(mykey, myurl)
{
    var my_value_array;
    var i;
    
    // Wenn der Anwender Werte fuer die Option hinterlegt hat ...
    if ( (myOptionsStorage[mykey] != undefined) && (myOptionsStorage[mykey].length > 0) ) {

	// ... Den Wert in seine Bestandteile zerlegen ...
	my_value_array = myOptionsStorage[mykey].split("\n");
	
	// ... die Bestandteile nacheinander testen ...
	for (i=0; i< my_value_array.length; i++) {
	    // ... wenn der Bestandteil und die URL identisch sind ...
	    if ( myurl == my_value_array[i] ) {
		return {value : true, matched_string : my_value_array[i] };
	    }
	}
    }
    
    return {value : false};
}

/*
 * Hilfsfunktion, um den Wert einer Option zu ermitteln
 * 
 * Es wird erwartet:
 *   Die Option ist als Zeichenkette gespeichert, die einzelnen Bestandteile sind durch \n getrennt
 *   Falls ein Bestandteil einen zusaetzlichen Wert hat, so ist dieser durch Leerzeichen getrennt
 *
 * mykey == der Name der Option (Schluessel im myOptionsStorage)
 * myurl == der Name der URL fuer die geprueft wird, ob eine Option hinterlegt ist.
 */
function sp_CheckOptionMatchValue(mykey, myurl)
{
    var my_parts_array;
    var my_values_array;
    var i;
    
    // Wenn der Anwender Werte fuer die Option hinterlegt hat ...
    if ( (myOptionsStorage[mykey] != undefined) && (myOptionsStorage[mykey].length > 0) ) {

	// ... Den Wert in seine Bestandteile zerlegen ...
	my_parts_array = myOptionsStorage[mykey].split("\n");
	
	// ... die Bestandteile nacheinander testen ...
	for (i=0; i< my_parts_array.length; i++) {

	    // Den Bestandteil in "match string" und "Wert" zerlegen
	    my_values_array = my_parts_array[i].split(" ");
	    
	    // ... wenn der Bestandteil irgendwo in der URL vorkommt ...
	    if ( myurl.indexOf(my_values_array[0]) >= 0 ) {

		var retval = "";
		var m;

		// die uebrigen Bestandteile von my_values_array[] wieder zu einer Zeichenkette zusammenfuegen
		for (m = 1; m < my_values_array.length; m++) {
		    retval = retval + my_values_array[m];
		    if ( m < my_values_array.length - 1 ) 
			retval = retval + " ";
		}
		
		// Ergebnis zurueckgeben
		return {value : true, matched_string : my_values_array[0], option_value : retval };
	    }
	}
    }
    
    return {value : false};
}

function sp_CheckOptionExactMatchValue(mykey, myurl)
{
    var my_parts_array;
    var my_values_array;
    var i;
    
    // Wenn der Anwender Werte fuer die Option hinterlegt hat ...
    if ( (myOptionsStorage[mykey] != undefined) && (myOptionsStorage[mykey].length > 0) ) {

	// ... Den Wert in seine Bestandteile zerlegen ...
	my_parts_array = myOptionsStorage[mykey].split("\n");
	
	// ... die Bestandteile nacheinander testen ...
	for (i=0; i< my_parts_array.length; i++) {

	    // Den Bestandteil in "match string" und "Wert" zerlegen
	    my_values_array = my_parts_array[i].split(" ");
	    
	    // ... wenn der Bestandteil gleich der URL ist ...
	    if ( myurl == my_values_array[0] ) {

		var retval = "";
		var m;

		// die uebrigen Bestandteile von my_values_array[] wieder zu einer Zeichenkette zusammenfuegen
		for (m = 1; m < my_values_array.length; m++) {
		    retval = retval + my_values_array[m];
		    if ( m < my_values_array.length - 1 ) 
			retval = retval + " ";
		}
		
		// Ergebnis zurueckgeben
		return {value : true, matched_string : my_values_array[0], option_value : retval };
	    }
	}
    }
    
    return {value : false};
}

/*
 * Hilfsfunktion, um das aktuelle Datum mit Uhrzeit als Zeichenkette auszugeben
 */
function sp_CurrentDate2String()
{
    var mydate = new Date();
    var my_Day;
    var my_Month;
    var my_Hours;
    var my_Minutes;
    var my_Seconds;

    my_Day = mydate.getDate();
    if (my_Day < 10 )
	my_Day = '0' + my_Day;
    
    my_Month = mydate.getMonth() + 1;
    if (my_Month < 10 )
	my_Month = '0' + my_Month;
    
    my_Hours = mydate.getHours();
    if (my_Hours < 10 )
	my_Hours = '0' + my_Hours;
    
    my_Minutes = mydate.getMinutes();
    if (my_Minutes < 10 )
	my_Minutes = '0' + my_Minutes;
    
    my_Seconds = mydate.getSeconds();
    if (my_Seconds < 10 )
	my_Seconds = '0' + my_Seconds;
    
    var myresult = my_Day + '.' + my_Month + '.' + mydate.getFullYear() + ' ' + my_Hours + ':' + my_Minutes + ':' + my_Seconds;
    
    return myresult;
}

 
 /*
  * Hilfsprozedur, um einen Text auf der Web-Console auszugeben
  * Das Praefix wird als globale Variable erwartet
  */
 
 function sp_printDebugLogMessage(mymessage)
 {
     console.log(SPMODULENAME + '[' + sp_CurrentDate2String() + '] : ' + mymessage);
 }
 
 /*
  * Hilfsprozedur, um eine Objekt auf der Web-Console auszugeben
  * Das Praefix wird als globale Variable erwartet
  * console.log gibt den Inhalt nicht aus, wenn das Objekt Teil eines String ist
  * daher ist eine eigene Funktion notwendig
  */
 
 function sp_printDebugLogObject(myname, myobject)
 {
     sp_printDebugLogMessage("content of object < " + myname + " > follows :")
     console.log(myobject);
 }
 
 


//
// **** END OF   : $Id: function_utils.js,v 1.6 2018/01/20 11:15:33 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_storage.js,v 1.11 2018/01/20 11:15:33 user Exp $ **** 
//

// Die Funktion LoadOptions() lädt die Filter aus dem lokalen Storage
function LoadOptions() {

    sp_printDebugLogMessage("LoadOptions() : Start");
    
// ================================================================================================================================
// **** START OF : $Id: function_storage__LoadOptions.js,v 1.3 2017/08/24 10:18:13 user Exp $ **** 
//


// Implementierung fuer Firefox

// das get() laeuft asynchron!
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/StorageArea/get
// Die Callback-Funktion LoadOptionsOnGot wird erst aufgerufen, wenn der ganze synchrone Ablauf erledigt ist,
// also erst nach dem Ende der Funktion LoadOptions()
//
browser.storage.local.get().then(LoadOptionsOnGot, LoadOptionsOnError);


//
// **** END OF   : $Id: function_storage__LoadOptions.js,v 1.3 2017/08/24 10:18:13 user Exp $ **** 
// ================================================================================================================================


    sp_printDebugLogMessage("LoadOptions() : End");

}

// Callback-Funktion, die aufgerufen wird, wenn das Laden der Daten erfolgreich war
// Diese Callback wird auch dann aktiv, wenn keine Daten gefunden wurden und item damit ein leeres Objekt ist.
function LoadOptionsOnGot(item) {

    sp_printDebugLogMessage("LoadOptionsOnGot() : Start");

    sp_printDebugLogObject("item",item);

    // Falls die gesuchten Werte im Storage vorhanden waren, diese auslesen
    if ( item["myOptionsSaved"] == undefined ) {
	
	// nichts zu tun, es liegen keine Werte vor
	sp_printDebugLogMessage("LoadOptionsOnGot() : no data found");

	//
	// Extrabehandlung fuer die Schriftgroesse bei Windows: hier ist small besser als der Standwert medium
	//
	if ( navigator.platform == "Win32" ) {
	    sp_printDebugLogMessage("LoadOptionsOnGot() : setting FontSize to small for platform Win32");
	    myOptionsStorage["myOptionFontSize"] = "small";
	}
	
    }
    else {
	sp_printDebugLogObject("item[myOptionsSaved]",item["myOptionsSaved"]);

	let mytmp = item["myOptionsSaved"];
	
	sp_printDebugLogObject("myOptionsStorage",myOptionsStorage);

	// Der globale Variablen "myOptionsStorage" die Werte zuweisen
	sp_printDebugLogMessage("LoadOptionsOnGot() : loading new values");

	// Beachte: eine Zuweisung der Art
	//    myOptionsStorage = mytmp;
	// fuehrt dazu, dass die Globale Variable alle gespeicherten Werte uebernimmt und
	// neue Objekt-Attribute, die vorgesehen sind, aber noch nicht gespeichert waren,
	// verloren gehen
	// Daher muessen die Werte einzeln uebernommen werden.
	// Sonst ist keine Veraenderung der Struktur der Globalen Variablen moeglich
	var i;
	var mykey;
	var mykeys = Object.keys(myOptionsStorage);
	sp_printDebugLogObject("LoadOptionsOnGot() : mykeys",mykeys);
	for ( i=0;i<mykeys.length;i++ ) {
	    mykey = mykeys[i];
	    sp_printDebugLogMessage("LoadOptionsOnGot() : mykey == " + mykey);
	    if ( mytmp[mykey] == undefined ) {
		sp_printDebugLogMessage("LoadOptionsOnGot() : no value stored for " + mykey);
	    }
	    else {
		if (mykey != "myOptionChangeUserAgentStandardValues") 
		    myOptionsStorage[mykey] = mytmp[mykey];
	    }
	}
	
	sp_printDebugLogObject("myOptionsStorage",myOptionsStorage);
 
    }
    
    // Die neuen Werte anzeigen, sofern diese Funktion im Options-JS benutzt wird.
    // Das backgroundscript liest die Werte nur, ohne sie anzuzeigen
    if ( SPMODULENAME == "spFilterWebContentOptions" )
	ShowOptions();

    // Die Schriftgroesse der Anzeige aendern, wenn das Laden der neuen Werte in der WebConsole geschieht
    if ( (SPMODULENAME == "spFilterWebContentConsole") || (SPMODULENAME == "spFilterWebContentOptions") ){
	sp_printDebugLogMessage("SETTING CSS RULE : " + "body {font-family: " + myOptionsStorage["myOptionFontFamily"] + ";font-size: " + myOptionsStorage["myOptionFontSize"] +  ";}");
	sp_printDebugLogMessage("myOwnCSSRuleIndex OLD == " + myOwnCSSRuleIndex);
	
	// Falls bereits eine CSS-Regel angelegt wurde, diese entfernen
	if ( myOwnCSSRuleIndex != -1 ) {
	    sp_printDebugLogMessage("deleting old rule");
	    document.styleSheets[0].deleteRule(myOwnCSSRuleIndex);
	}
	
	// eine neue Regel an Index 0 anlegen
	myOwnCSSRuleIndex = document.styleSheets[0].insertRule("body {font-family: " + myOptionsStorage["myOptionFontFamily"]
							       + ";font-size: "+ myOptionsStorage["myOptionFontSize"] +  ";}", 0);
	sp_printDebugLogMessage("myOwnCSSRuleIndex NEW == " + myOwnCSSRuleIndex);
    }


    //
    // Die Konfiguration auf Sicherheit pruefen
    //
    myOptionsStorage_CheckConfigurationSecurity();
    
    sp_printDebugLogMessage("LoadOptionsOnGot() : End");
    
}


function LoadOptionsOnError(error) {
    sp_printDebugLogMessage("LoadOptionsOnError() : " + error);
}


//
// Die folgende Funktion registriert einen Listener fuer Storage-Aenderungen

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/onChanged
function listenToStorageChanges(){
    //sp_printDebugLogMessage("listenToStorageChanges() : START");
    browser.storage.onChanged.addListener(detectStorageChange);
    //sp_printDebugLogMessage("listenToStorageChanges() : END");
}

function detectStorageChange(change, area){
    //Ignore the change information. Just re-get all options
    sp_printDebugLogMessage('Detected storage change in area ' + area + " : " + change);
    LoadOptions();
}


function stopListeningToStorageChanges(){
    browser.storage.onChanged.removeListener(detectStorageChange);
}


//
// **** END OF   : $Id: function_storage.js,v 1.11 2018/01/20 11:15:33 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnAuthRequired_Report.js,v 1.5 2019/11/24 07:50:47 user Exp $ **** 
//

/*
 * Hier sind alle Funktionen versammelt, die im Zusammenhang mit
 *   OnAuthRequired
 * stehen
 */

// Registrierung des Listener
function spAdd_OnAuthRequired_Listener_Report()
{
    browser.webRequest.onAuthRequired.addListener(
	spOnAuthRequired_Report,
	{
	    urls: ["<all_urls>"]
	},
	["blocking", "responseHeaders"]
    );
    
}


// Entfernen des Listener
function spRemove_OnAuthRequired_Listener_Report()
{
    browser.webRequest.onAuthRequired.removeListener(spOnAuthRequired_Report);
}


// Callback-Funktion des Listener
function spOnAuthRequired_Report(details) {
    
    var myspan;
    var mydiv_id;
    
    mydiv_id=sp_CreateDivID(details.requestId);
    
    // Sofern die Webseite fuer die Nachrichten vorhanden ist, in dieser eine Meldung anzeigen
    if ( document.getElementById(mydiv_id) != null ) {
	myspan = document.createElement('SPAN');
	myspan.className="spMessageAuthRequired";
	try {
	    //myspan.innerHTML = "<br>" + sp_CurrentDate2String() + " AuthRequired: challenger = " + details.challenger.host + ":" + details.challenger.port;
	    //myspan.innerHTML = myspan.innerHTML + "<br>" + sp_CurrentDate2String() + " AuthRequired: scheme = " + details.scheme;
	    //myspan.innerHTML = myspan.innerHTML + "<br>" + sp_CurrentDate2String() + " AuthRequired: realm  = " + details.realm;
	    
	    myspan.appendChild(document.createElement("BR"));
	    myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " AuthRequired: challenger = " + details.challenger.host + ":" + details.challenger.port));
	    myspan.appendChild(document.createElement("BR"));
	    myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " AuthRequired: scheme = " + details.scheme));
	    myspan.appendChild(document.createElement("BR"));
	    myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " AuthRequired: realm  = " + details.realm));
	    
	}
	catch(e) {
	}  
	document.getElementById(mydiv_id).appendChild(myspan);
    }
    return { cancel: false };
}

//
// **** END OF   : $Id: function_Listener_OnAuthRequired_Report.js,v 1.5 2019/11/24 07:50:47 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnBeforeRedirect_Report.js,v 1.6 2019/11/24 07:50:47 user Exp $ **** 
//

/*
 * Hier sind alle Funktionen versammelt, die im Zusammenhang mit
 *   OnBeforeRedirect
 * stehen
 *
 * webRequest.onBeforeRedirect
 *    Fired when a server-initiated redirect is about to occur.
 */

// Registrierung des Listener
function spAdd_OnBeforeRedirect_Listener_Report()
{
    browser.webRequest.onBeforeRedirect.addListener(
	spOnBeforeRedirect_Report,
	{ urls: ["<all_urls>"] },
	["responseHeaders" ]
    );
    
}


// Entfernen des Listener
function spRemove_OnBeforeRedirect_Listener_Report()
{
    browser.webRequest.onBeforeRedirect.removeListener(spOnBeforeRedirect_Report);
}


// Callback-Funktion des Listener
function spOnBeforeRedirect_Report(details) {
	
    var myspan;
    var mydiv_id;
    
    mydiv_id=sp_CreateDivID(details.requestId);
    
    // Sofern die Webseite fuer die Nachrichten vorhanden ist, in dieser eine Meldung anzeigen
    if ( document.getElementById(mydiv_id) != null ) {
	myspan = document.createElement('SPAN');
	myspan.className="spMessageRedirect";
	
	//myspan.innerHTML = "<br>" + sp_CurrentDate2String() + " REDIRECT: " + details.redirectUrl;
	myspan.appendChild(document.createElement("BR"));
	myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " REDIRECT: " + details.redirectUrl));
	
	document.getElementById(mydiv_id).appendChild(myspan);
    }
    return { cancel: false };
}


//
// **** END OF   : $Id: function_Listener_OnBeforeRedirect_Report.js,v 1.6 2019/11/24 07:50:47 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnBeforeRequest_Report.js,v 1.22 2022/08/06 19:45:38 user Exp $ **** 
//

/*
 * der vom live-script genutzte Listener, um ueber WebRequests Auskunft geben zu koennen.
 * Hier:
 *   onBeforeRequest
 * 
 */

// Registrierung des Listener
function spAdd_OnBeforeRequest_Listener_Report()
{
    // Registrierung eines Listener, der Webrequests vor dem Abschicken abfaengt
    // Das background-script blockiert ggf den Request
    // das Console-HTML zeigt die Daten an
    sp_printDebugLogMessage("spAdd_OnBeforeRequest_Listener_Report() : adding Listener spOnBeforeRequestListener_Report()");


    // Firefox 52esr kennt die Parameter "requestBody" nicht
    if ( navigator.userAgent.indexOf("Firefox/52.") > 0 )
	browser.webRequest.onBeforeRequest.addListener(
	    spOnBeforeRequestListener_Report,
	    { urls: ["<all_urls>"] },
	    ["blocking"]
	);
    else
	browser.webRequest.onBeforeRequest.addListener(
	    // Each addListener() call takes a mandatory callback function as the first parameter. "details" is an object
	    spOnBeforeRequestListener_Report,
	    
	    // The webRequest.RequestFilter filter allows limiting the requests for which events are triggered in various dimensions
	    // ResourceType: "main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", or "other"
	    {
		urls: ["<all_urls>"]
	    },
	    
	    // If the optional opt_extraInfoSpec array contains the string 'blocking' (only allowed for specific events),
	    // the callback function is handled synchronously. 
	    ["blocking","requestBody"]
	);
}


// Entfernen des Listener
function spRemove_OnBeforeRequest_Listener_Report()
{
    browser.webRequest.onBeforeRequest.removeListener(spOnBeforeRequestListener_Report);
    
}

// Callback-Funktion des Listener
function spOnBeforeRequestListener_Report(details) {
    
    sp_printDebugLogObject("spOnBeforeRequestListener_Report() : details", details);

    // Falls der Anwender die Ausgabe der Meldung unterdrueckt hat, nichts tun
    if (isSuppressAllURL(details) == true )
	return { cancel: false };
	

    // Die Informationen ueber den Webrequest ausgeben
    
    var mydiv_id = sp_CreateDivID(details.requestId);
    var myspan1 = document.createElement('SPAN');
    var myspan2 = document.createElement('SPAN');
    var mydiv;
    var myurlprintlength = 0;
    
    //
    // Falls es sich um einen internen Request handelt, diesen nicht oder nur verkuerzt anzeigen
    // wenn der Anwender dies wuenscht
    //
    if ( details.url.substring(0,"data:".length) == "data:" ) {
	
	if (myOptionsStorage["myOptionShowDataRequest"] != undefined) {
	    
	    // Option "verkuerzte Anzeige"
	    if ( myOptionsStorage["myOptionShowDataRequest"] == "short")
		myurlprintlength = 64;
	    // Option "nicht anzeigen"
	    else {
		if (myOptionsStorage["myOptionShowDataRequest"] != "yes") 
		    return { cancel: false };
	    }
	}
    }
    
    // vorhandenes DIV nutzen
    if ( document.getElementById(mydiv_id) != null ) {
	mydiv = document.getElementById(mydiv_id);
	myspan1.appendChild(document.createElement("BR"));
    }
    // oder neues anlegen
    else {
	mydiv = document.createElement('DIV');
	mydiv.id = mydiv_id;
	mydiv.className = "spMessage";
    }
    
    // Beachte: Den Inhalt des myspan1 soll man nicht einfach durch Zuweisung an .innerHTML fuellen:
    //    myspan1.innerHTML = sp_CurrentDate2String() + " [<b>" + details.type.toUpperCase() + "</b>] : " + details.url;
    // Grund: die variablen Bestandteile, die hier eingebaut werden, koennten unangenehme Nebeneffekte hervorrufen,
    //   wenn der Browser darin Steuerzeichen auswertet.
    // Besser ist es, diese Bestandteile ueber .createTextNode() einzubauen, dann wird der Browser das Ergebnis nicht interpretieren
    
    //myspan1.innerHTML = sp_CurrentDate2String() + " [<b>" + details.type.toUpperCase() + "</b>] : " + details.url;
    myspan1.appendChild(document.createTextNode(sp_CurrentDate2String() + " RequestType ["));
    var b0 = document.createElement("B");
    b0.appendChild(document.createTextNode(details.type.toUpperCase()));
    myspan1.appendChild(b0);
    myspan1.appendChild(document.createTextNode("] : "));

    if ( myurlprintlength > 0 ) {
	myspan1.appendChild(document.createTextNode(details.url.substring(0,myurlprintlength) + " ..."));
	myspan1.className = "spMessage" + details.type.toUpperCase() + "_short";
    }
    else {
	myspan1.appendChild(document.createTextNode(details.url));
	myspan1.className = "spMessage" + details.type.toUpperCase();
    }

    //
    // Die Methode ausgeben, wenn es nicht GET ist
    //
    if ( details.method !== "GET" ) {
	//myhtmltext = "<br>" + sp_CurrentDate2String() + " method=<b>" + details.method + "</b>";
	myspan1.appendChild(document.createElement("BR"));
	myspan1.appendChild(document.createTextNode(sp_CurrentDate2String() + " method="));
	var b0 = document.createElement("B");
	b0.appendChild(document.createTextNode(details.method));
	myspan1.appendChild(b0);
    }
    
    mydiv.appendChild(myspan1);

    // Falls ein Request Body vorhanden ist, dessen Inhalt anzeigen
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest/onBeforeRequest
    // requestBody : object : Contains the HTTP request body data.
    //     error : optional string. This is set if any errors were encountered when obtaining request body data.
    //     formData : optional object
    //     raw : optional object
    if ( (details.requestBody != undefined) && (details.requestBody != null) ) {

	var datafound = false;
	
	myspan2.appendChild(document.createElement("BR"));

	// Falls die Daten des RequestBody nicht angezeigt werden sollen ...
	if ( isShowFormDataURL(details) == false ) {

	    // ... dies melden
	    myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " requestBody exists, use form data option to show the data."));
	    
	}
	
	// Falls die Daten des RequestBody angezeigt werden sollen ...
	else {
	    
	    var max_char_to_show;
	    
	    // feststellen, wieviel vom RequestBody angezeigt werden soll
	    if ( (myOptionsStorage["myOptionMaxFormBytes"] != undefined) && (myOptionsStorage["myOptionMaxFormBytes"].length > 0) ) {

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
		//
		// Unlike in other languages which either throw an error or just assume 0 when a string cannot be converted to an integer,
		// parseInt() returns "NaN" which means "Not-a-Number".
		// There is a function that can check for NaN and is called isNaN()
		// Other approach: the key is the "|| 0", basically,
		// if parseInt() does not return a number the || operator is invoked which then returns another number instead.
		//
		// Standardwert ist 1 MB
		max_char_to_show = parseInt(myOptionsStorage["myOptionMaxFormBytes"]) || 1048576;
		if ( max_char_to_show < 0 )
		    max_char_to_show = 1048576;
	    }
	    
	    
	    // Falls ein Fehler vorliegt ...
	    if ( ( details.requestBody.error != undefined) && (details.requestBody.error != null) ) {
		datafound = true;
		myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " requestBody error = " + details.requestBody.error));
	    } // Es lag eine Fehlermeldung vor
	    
	    
	    //
	    // Falls Form Data vorliegen ...
	    // formData
	    // This object is present if the request method is POST and the body is a sequence of key-value pairs encoded
	    // in UTF-8 as either "multipart/form-data" or "application/x-www-form-urlencoded".
	    // It is a dictionary in which each key contains the list of all values for that key.
	    // For example: {'key': ['value1', 'value2']}.
	    // If the data is of another media type, or if it is malformed, the object is not present.
	    //
	    
	    if ( ( details.requestBody.formData != undefined) && (details.requestBody.formData != null) ) {
		datafound = true;

		var k;
		var myreqkeys = Object.keys(details.requestBody.formData);
		var mystring_key;
		var mystring_data;
		var myend_key;
		var myend_data;
		var myindex;
		// Die einzelnen Schluessel durchgehen und Schluessel und Wert ausgeben
		if ( myreqkeys.length == 0 )
		    myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " requestBody form data is empty"));
		else {
		    
		    for ( k = 0; k < myreqkeys.length; k++ ) {

			if ( (myreqkeys.length > 10) && (k < 10) ) 
			    myindex="0" + k;
			else
			    myindex=k;
			
			// Notfalls die Ausgabe des Schluessels begrenzen
			mystring_key = String(myreqkeys[k]);
			if ( mystring_key.length > max_char_to_show ) 
			    myend_key = "... (" + max_char_to_show + "/" + mystring_key.length + " chars)";
			else
			    myend_key = "";
			
			// Notfalls die Ausgabe des Wertes begrenzen
			mystring_data = String(details.requestBody.formData[myreqkeys[k]]);
			if ( mystring_data.length > max_char_to_show ) 
			    myend_data = "... (" + max_char_to_show + "/" + mystring_data.length + " chars)";
			else
			    myend_data = "";
 			myspan2.appendChild(document.createTextNode(sp_CurrentDate2String()
								    + " FormData[" + myindex + "] : "
								    + " key  = "
								    + mystring_key.substring(0,max_char_to_show)
								    + myend_key));
			myspan2.appendChild(document.createElement("BR"));
 			myspan2.appendChild(document.createTextNode(sp_CurrentDate2String()
								    + " FormData[" + myindex + "] : "
								    + " len  = "
								    + mystring_data.length));
			myspan2.appendChild(document.createElement("BR"));
			myspan2.appendChild(document.createTextNode(sp_CurrentDate2String()
								    + " FormData[" + myindex + "] : "
								    + " data  = "
								    + mystring_data.substring(0,max_char_to_show)
								    + myend_data));
			
			if ( k < myreqkeys.length - 1 )
			    myspan2.appendChild(document.createElement("BR"));
		    }
		}
	    } // Es lagen FormData vor
	     
	    // 
	    // raw -- array of webRequest.UploadData.
	    //        If the request method is PUT or POST, and the body is not already parsed in formData,
	    //        then this array contains the unparsed request body elements.
	    //
	    // webRequest.UploadData
	    //        Values of this type are objects. They contain the following properties:
	    //        bytes (Optional)  any.    An ArrayBuffer with a copy of the data.
	    //        file  (Optional)  string. A string with the file's path and name.
	    //
	    // The ArrayBuffer object is used to represent a generic, fixed-length raw binary data buffer.
	    
	    if ( ( details.requestBody.raw != undefined) && (details.requestBody.raw != null) ) {
		datafound = true;

		//myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " requestBody raw data present"));
		if ( details.requestBody.raw.length == 0 )
		    myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " requestBody raw data is empty"));
		else {
		    var k;
		    for (k = 0; k < details.requestBody.raw.length; k++) {

			// Wurde eine Datei angehaengt, dann den Dateinamen und die Laenge ausgeben
			if ( (details.requestBody.raw[k].file != undefined) && (details.requestBody.raw[k].file != null) ) {
			    myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " RawData[" + k + "] file : "
									+ details.requestBody.raw[k].file));
			}
			
			// Wurden nackte Bytes angehaengt, dann diese ausgeben
			if ( (details.requestBody.raw[k].bytes != undefined) && (details.requestBody.raw[k].bytes != null) ) {

			    // Die Laenge ausgeben
			    myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " RawData[" + k + "] : "
									+ "len  = " + details.requestBody.raw[k].bytes.byteLength));
			    
			    myspan2.appendChild(document.createElement("BR"));

			    // Die Daten ausgeben
			    myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " RawData[" + k + "] : "
									+ "data = "));
									
			    // Die einzelnen Bytes, als druckbares Zeichen umgewandelt
			    var myDataView = new DataView(details.requestBody.raw[k].bytes);
			    var m;
			    var max;
			    var endchar;
			    
			    if ( details.requestBody.raw[k].bytes.byteLength > max_char_to_show ) {
				max = max_char_to_show;
				endchar = " ... (" + max_char_to_show + "/" + details.requestBody.raw[k].bytes.byteLength + " chars)";
			    }
			    else {
				max = details.requestBody.raw[k].bytes.byteLength;
				endchar = "";
			    }
			    for (m=0;m<max;m++) {
				myspan2.appendChild(document.createTextNode( String.fromCharCode(myDataView.getUint8(m))));
			    }
			    myspan2.appendChild(document.createTextNode(endchar));
			    
			}
			
			if ( k < details.requestBody.raw.length - 1 )
			    myspan2.appendChild(document.createElement("BR"));
		    }
		}
	    } // Es lagen raw-Data vor

	    // Es liegen Daten vor, aber es ist keiner der erwarteten Typen ...
	    if ( datafound == false ) {
		// ... dies melden
		myspan2.appendChild(document.createTextNode(sp_CurrentDate2String()
							    + "ERROR -- requestBody does not contain expected keys. Actual keys are : "
							    + Object.Keys(details.requestBody)));
	    }
	    
	} // Es sollten die Daten des RequestBody angezeigt werden.
	
	
	myspan2.className = "spRequestBody";
	mydiv.appendChild(myspan2);
    }
    else {
	myspan2.appendChild(document.createElement("BR"));
	if ( details.method == "POST" ) {
	    myspan2.appendChild(document.createTextNode(sp_CurrentDate2String() + " requestBody does not exist"));
	    myspan2.className = "spRequestBody";
	    mydiv.appendChild(myspan2);
	}
    }
    
    document.body.appendChild(mydiv);
    
    //
    // Diese Callback-Funktion dient nur der Ausgabe. Sie blockiert nichts
    return { cancel: false };
}

function isSuppressAllURL(details)
{
    var urlname = details.url.toLowerCase();
    
    var my_all_array;
    var i;
    
    sp_printDebugLogMessage("isSuppressAllURL STARTED: " + urlname);
    
    if ( (myOptionsStorage["myOptionSuppressAllURL"] != undefined) && (myOptionsStorage["myOptionSuppressAllURL"].length > 0) ) {
	
	//sp_printDebugLogMessage("isSuppressAllURL my_all_array=" + my_all_array);
	
	my_all_array = myOptionsStorage["myOptionSuppressAllURL"].split("\n");
	
	//sp_printDebugLogMessage("isSuppressAllURL my_all_array.length == " + my_all_array.length);
	for (i=0; i< my_all_array.length; i++) {
            //sp_printDebugLogMessage("isSuppressAllURL my_all_array[" + i + "] == " + my_all_array[i]);
            if ( urlname.indexOf(my_all_array[i]) >= 0 ) {
		sp_printDebugLogMessage("isSuppressAllURL returns TRUE");
		return true;
            }
	} 
    }
    
    sp_printDebugLogMessage("isSuppressAllURL returns FALSE");
    return false;
}

function isShowFormDataURL(details)
{
    var urlname = details.url.toLowerCase();
    
    var my_all_array;
    var i;
    
    sp_printDebugLogMessage("isShowFormDataURL STARTED: " + urlname);
    
    if ( (myOptionsStorage["myOptionShowFormDataURL"] != undefined) && (myOptionsStorage["myOptionShowFormDataURL"].length > 0) ) {
	
	//sp_printDebugLogMessage("isShowFormDataURL my_all_array=" + my_all_array);
	
	my_all_array = myOptionsStorage["myOptionShowFormDataURL"].split("\n");
	
	//sp_printDebugLogMessage("isShowFormDataURL my_all_array.length == " + my_all_array.length);
	for (i=0; i< my_all_array.length; i++) {
            //sp_printDebugLogMessage("isShowFormDataURL my_all_array[" + i + "] == " + my_all_array[i]);
            if ( urlname.indexOf(my_all_array[i]) >= 0 ) {
		sp_printDebugLogMessage("isShowFormDataURL returns TRUE");
		return true;
            }
	} 
    }
    
    sp_printDebugLogMessage("isShowFormDataURL returns FALSE");
    return false;
}

//
// **** END OF   : $Id: function_Listener_OnBeforeRequest_Report.js,v 1.22 2022/08/06 19:45:38 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnCompleted_Report.js,v 1.11 2022/08/06 19:36:40 user Exp $ **** 
//


/*
 * Hier sind alle Funktionen versammelt, die im Zusammenhang mit
 *   OnCompleted
 * stehen
 *
 * webRequest.onCompleted
 *    Fired when a request is completed.
 */


// Registrierung des Listener
function spAdd_OnCompleted_Listener_Report()
{
    browser.webRequest.onCompleted.addListener(
	spOnCompleted_Report,
	{ urls: ["<all_urls>"] },
	["responseHeaders"]
    );
    
}


// Entfernen des Listener
function spRemove_OnCompleted_Listener_Report()
{
    browser.webRequest.onCompleted.removeListener(spOnCompleted_Report);
}


// Callback-Funktion des Listener
function spOnCompleted_Report(details) {
    
    var myspan;
    var mydiv_id;
    var i;
    var j;
    var my_options_array;
    var max_char_to_show;
    var mystring_data;
    var myend_data;
    var b0;
    var myindex;
    
    mydiv_id=sp_CreateDivID(details.requestId);
    
    // Sofern die Webseite fuer die Nachrichten vorhanden ist, in dieser eine Meldung anzeigen
    if ( document.getElementById(mydiv_id) != null ) {
	
	myspan = document.createElement('SPAN');
	//sp_printDebugLogObject("onCompleted.addListener details",details);
	
	// es kann vorkommen, dass details.statusLine nicht definiert ist
	// Dies geschieht, wenn der Request nicht ueber http ging, sondern die Daten z.B. aus einen stylesheet stammen
	// Dort kann man Bilder hinterlegen, die base64 codiert sind.
	// Der Browser kann so Bilder anzeigen, die nicht ueber http geholt wurden :
	//     [IMAGE] : data:image/png;base64, ......
	if ( details.statusLine == undefined ) {
	    sp_printDebugLogMessage("webRequest.onCompleted Listener [" + mydiv_id + "] : details.statusLine == undefined");
	    myspan.appendChild(document.createElement("BR"));
	    myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " StatusLine: [cache=" + details.fromCache + "] : ( no response status)"));
	}
	else {
	    //myspan.innerHTML = "<br>" + sp_CurrentDate2String() + " [cache=" + details.fromCache + "] : " + details.statusLine;
	    myspan.appendChild(document.createElement("BR"));
	    myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " StatusLine: [cache=" + details.fromCache + "] : " + details.statusLine));
	}
	
	if ( (details.statusCode != undefined) &&  (details.statusCode == 200) ) {
	    myspan.className = "spMessageResultOK";
	}
	else {
	    myspan.className = "spMessageResultNOK";
	}
	
	if ( details.responseHeaders == undefined ) {
	    sp_printDebugLogMessage("webRequest.onCompleted Listener [" + mydiv_id + "] : details.responseHeaders == undefined");
	}
	else {

	    // Sofern fuer die URL die Anzeige von Headern nicht unterdrueckt ist ...
	    // isBlockedHeaderURL() ist in function_Listener_OnSendHeaders_Report.js definiert
	    if ( isBlockedHeaderURL(details) == false ) {
	    
		my_options_array = myOptionsStorage["myOptionShowResponseHeaders"].split("/");
		
		// feststellen, wieviel von den Headers angezeigt werden soll
		if ( (myOptionsStorage["myOptionMaxHeaderBytes"] != undefined) && (myOptionsStorage["myOptionMaxHeaderBytes"].length > 0) ) {
		    
		    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
		    //
		    // Unlike in other languages which either throw an error or just assume 0 when a string cannot be converted to an integer,
		    // parseInt() returns "NaN" which means "Not-a-Number".
		    // There is a function that can check for NaN and is called isNaN()
		    // Other approach: the key is the "|| 0", basically,
		    // if parseInt() does not return a number the || operator is invoked which then returns another number instead.
		    //
		    // Standardwert ist 1 MB
		    max_char_to_show = parseInt(myOptionsStorage["myOptionMaxHeaderBytes"]) || 1048576;
		    if ( max_char_to_show < 0 )
			max_char_to_show = 1048576;
		}

		// Header alphabetisch sortieren
		details.responseHeaders.sort(
		    function(a,b)
		    {
			if ( a["name"].toLowerCase() === b["name"].toLowerCase() ) {
			    return 0;
			}
			if ( a["name"].toLowerCase() > b["name"].toLowerCase() ) {
			    return 1;
			} else {
			    return -1;
			}
		    }
		);
		
		// Die Response-Header einzeln durchgehen ...
		for (i=0;i<details.responseHeaders.length;i++) {

		    // Falls der Header ausgegeben werden soll ....
		    for(j=0;j<my_options_array.length;j++) {
			
			if ( details.responseHeaders[i].name.toLowerCase().indexOf(my_options_array[j]) >= 0 ) {
			    
			    //myspan.innerHTML = myspan.innerHTML
                            //    + "<br>" + sp_CurrentDate2String() + " ResponseHeader[" + i + "] "
                            //    + details.responseHeaders[i].name + "=" + details.responseHeaders[i].value ;


			    // Den Index notfalls formatieren
			    if ( (details.responseHeaders.length > 10) && (i < 10) )
				myindex="0" + i;
			    else
				myindex=i;
			    
			    myspan.appendChild(document.createElement("BR"));
			    myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " ResponseHeader[" + myindex + "] "));
			    
			    // Notfalls die Ausgabe des Wertes begrenzen
			    mystring_data = String(details.responseHeaders[i].value);
			    if ( mystring_data.length > max_char_to_show ) 
				myend_data = "... (" + max_char_to_show + "/" + mystring_data.length + " chars)";
			    else
				myend_data = "";
			    
			    // Name
			    myspan.appendChild(document.createTextNode(details.responseHeaders[i].name));
			    // Trennsymbol
			    b0 = document.createElement("B");
			    b0.appendChild(document.createTextNode(" = "));
			    myspan.appendChild(b0);
			    // Wert
			    myspan.appendChild(document.createTextNode(mystring_data.substring(0,max_char_to_show) + myend_data));

			    // Weitere Werte aus dem Options-Array muessen nicht mehr untersucht werden
			    // Es geht mit dem naechsten Header weiter
			    break;
			}
		    }
		}
	    }
	}
	
	// Es kommt vor, dass der onCompleted-Listener doppelt aufgerufen wird.
	// Bei Firefox ist das der Fall, wenn die URL etwas wie
	//     data:image/png;base64,
	// ist und details.responseHeaders damit undefined
	//
	// In diesem Fall soll nur eine Nachricht erscheinen
	var mydiv = document.getElementById(mydiv_id);
	//sp_printDebugLogObject("onCompleted.addListener mydiv",mydiv);
	var myarray = mydiv.getElementsByClassName("spMessageResultNOK");
	
	if (myarray.length == 0 )
	    document.getElementById(mydiv_id).appendChild(myspan);
	
    }
    
    return { cancel: false };
}

//
// **** END OF   : $Id: function_Listener_OnCompleted_Report.js,v 1.11 2022/08/06 19:36:40 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnErrorOccurred_Report.js,v 1.8 2020/03/28 11:06:10 user Exp $ **** 
//

/*
 * Hier sind alle Funktionen versammelt, die im Zusammenhang mit
 *   OnErrorOccurred
 * stehen.
 *
 * webRequest.onErrorOccurred
 *  Fired when an error occurs.
 */

// Registrierung des Listener
function spAdd_OnErrorOccurred_Listener_Report()
{
  browser.webRequest.onErrorOccurred.addListener(
    spOnErrorOccurred_Report,
    { urls: ["<all_urls>"] }
  );
  
}


// Entfernen des Listener
function spRemove_OnErrorOccurred_Listener_Report()
{
    browser.webRequest.onErrorOccurred.removeListener(spOnErrorOccurred_Report);
}


// Callback-Funktion des Listener
function spOnErrorOccurred_Report(details) {
    
    var myspan;
    var mydiv_id;
    
    mydiv_id=sp_CreateDivID(details.requestId);
    
    // Sofern die Webseite fuer die Nachrichten vorhanden ist, in dieser eine Meldung anzeigen
    if ( document.getElementById(mydiv_id) != null ) {
	myspan = document.createElement('SPAN');
	myspan.className = "spMessageResultError";
	
	//myspan.innerHTML = "<br>" + sp_CurrentDate2String() + " [cache=" + details.fromCache + "] : " + details.error;
	myspan.appendChild(document.createElement("BR"));
	myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " StatusLine : " + details.error));
	
	document.getElementById(mydiv_id).appendChild(myspan);
    }
    
    return { cancel: false };
}


//
// **** END OF   : $Id: function_Listener_OnErrorOccurred_Report.js,v 1.8 2020/03/28 11:06:10 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnSendHeaders_Report.js,v 1.9 2022/08/06 19:35:09 user Exp $ **** 
//

/*
 * Hier sind alle Funktionen versammelt, die im Zusammenhang mit
 *   OnSendHeaders
 * stehen.
 *
 * Notwendig, um die endgueltigen Requestheader zu sehen
 *
 *
 * webRequest.onSendHeaders
 *   Fired just before sending headers. If your add-on or some other add-on modified headers in onBeforeSendHeaders, 
 *   you'll see the modified version here.
 */

// Registrierung des Listener
function spAdd_OnSendHeaders_Listener_Report()
{
    browser.webRequest.onSendHeaders.addListener(
	spOnSendHeaders_Report,
	{ urls: ["<all_urls>"] },
	["requestHeaders"]
	
    );
    
}

// Entfernen des Listener
function spRemove_OnSendHeaders_Listener_Report()
{
    browser.webRequest.onSendHeaders.removeListener(spOnSendHeaders_Report);
}

// Callback-Funktion des Listener
/*
 */
function spOnSendHeaders_Report(details) {
    
    var myspan;
    var mydiv_id;
    var i;
    var j;
    var myhtmltext="";
    var my_options_array;
    var mytestval;
    var max_char_to_show;
    var mystring_data;
    var myend_data;
    var b0;
    var myindex;
    
    mydiv_id=sp_CreateDivID(details.requestId);

    sp_printDebugLogMessage("spOnSendHeaders_Report() -- START");
    
    // Sofern fuer die URL die Anzeige von Headern nicht unterdrueckt ist ...
    if ( isBlockedHeaderURL(details) == false ) {
	
	// Sofern die Webseite fuer Nachrichten vorhanden ist, in dieser eine Meldung anzeigen
	if ( document.getElementById(mydiv_id) != null ) {

	    myspan = document.createElement('SPAN');
	    myspan.className="spMessageRequestHeaders";
	    
	    my_options_array = myOptionsStorage["myOptionShowRequestHeaders"].split("/");


	    // feststellen, wieviel von den Headers angezeigt werden soll
	    if ( (myOptionsStorage["myOptionMaxHeaderBytes"] != undefined) && (myOptionsStorage["myOptionMaxHeaderBytes"].length > 0) ) {

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
		//
		// Unlike in other languages which either throw an error or just assume 0 when a string cannot be converted to an integer,
		// parseInt() returns "NaN" which means "Not-a-Number".
		// There is a function that can check for NaN and is called isNaN()
		// Other approach: the key is the "|| 0", basically,
		// if parseInt() does not return a number the || operator is invoked which then returns another number instead.
		//
		// Standardwert ist 1 MB
		max_char_to_show = parseInt(myOptionsStorage["myOptionMaxHeaderBytes"]) || 1048576;
		if ( max_char_to_show < 0 )
		    max_char_to_show = 1048576;
	    }

	    // Header alphabetisch sortieren
	    details.requestHeaders.sort(
		function(a,b)
		{
		    if ( a["name"].toLowerCase() === b["name"].toLowerCase() ) {
			return 0;
		    }
		    if ( a["name"].toLowerCase() > b["name"].toLowerCase() ) {
			return 1;
		    } else {
			return -1;
		    }
		}
	    );
	    
	    // Die RequestHeaders durchgehen ...
	    for (i=0;i<details.requestHeaders.length;i++) {
		
		// Die Options-Zeichenketten durchgehen ...
		for(j=0;j<my_options_array.length;j++) {
		    
		    // Wenn die Options-Zeichenkette im Namen des RequestHeader vorhanden ist ...
		    if ( details.requestHeaders[i].name.toLowerCase().indexOf(my_options_array[j]) >= 0 ) {
			
			// Request-Header mit Namen und Wert ausgeben.
			
			//myhtmltext = myhtmltext + "<br>" + sp_CurrentDate2String() + " RequestHeader[" + i + "] ";
			//myhtmltext = myhtmltext + details.requestHeaders[i].name + "=" + details.requestHeaders[i].value ;

			// Den Index notfalls formatieren
			if ( (details.requestHeaders.length > 10) && (i < 10) ) 
			    myindex="0" + i;
			else
			    myindex=i;
			
			myspan.appendChild(document.createElement("BR"));
			myspan.appendChild(document.createTextNode(sp_CurrentDate2String() + " RequestHeader[" + myindex + "] "));

			// Notfalls die Ausgabe des Wertes begrenzen
			mystring_data = String(details.requestHeaders[i].value);
			if ( mystring_data.length > max_char_to_show ) 
			    myend_data = "... (" + max_char_to_show + "/" + mystring_data.length + " chars)";
			else
			    myend_data = "";

			
			// Name
			myspan.appendChild(document.createTextNode(details.requestHeaders[i].name));
			// Trennsymbol
			b0 = document.createElement("B");
			b0.appendChild(document.createTextNode(" = "));
			myspan.appendChild(b0);
			// Wert
			myspan.appendChild(document.createTextNode(mystring_data.substring(0,max_char_to_show) + myend_data));

			// Weitere Werte aus dem Options-Array muessen nicht mehr untersucht werden
			// Es geht mit dem naechsten Header weiter
			break;
		    } 
		} // for(j=0;j<my_options_array.length;j++) {
	    } // for (i=0;i<details.requestHeaders.length;i++) {
	    
	    if ( myspan.innerHTML  !== "" ) {
		document.getElementById(mydiv_id).appendChild(myspan);
	    }
	}
    }

    sp_printDebugLogMessage("spOnSendHeaders_Report() -- END");
    return { cancel: false };
}


function isBlockedHeaderURL(details)
{
    var urlname = details.url.toLowerCase();

    var my_all_array;
    var i;
    
    sp_printDebugLogMessage("isBlockedHeaderURL STARTED: " + urlname);
    
    if ( (myOptionsStorage["myOptionNoHeaderURL"] != undefined) && (myOptionsStorage["myOptionNoHeaderURL"].length > 0) ) {
	
	//sp_printDebugLogMessage("isBlockedHeaderURL my_all_array=" + my_all_array);
	
	my_all_array = myOptionsStorage["myOptionNoHeaderURL"].split("\n");
	
	//sp_printDebugLogMessage("isBlockedHeaderURL my_all_array.length == " + my_all_array.length);
	for (i=0; i< my_all_array.length; i++) {
            //sp_printDebugLogMessage("isBlockedHeaderURL my_all_array[" + i + "] == " + my_all_array[i]);
            if ( urlname.indexOf(my_all_array[i]) >= 0 ) {
		sp_printDebugLogMessage("isBlockedHeaderURL returns TRUE");
		return true;
            }
	} 
    }
    
    sp_printDebugLogMessage("isBlockedHeaderURL returns FALSE");
    return false;
}


//
// **** END OF   : $Id: function_Listener_OnSendHeaders_Report.js,v 1.9 2022/08/06 19:35:09 user Exp $ **** 
// ================================================================================================================================


//
// **** END OF   : $Id: spFilterWebContent.live.js,v 1.25 2018/01/20 11:15:33 user Exp $ **** 
// ================================================================================================================================
