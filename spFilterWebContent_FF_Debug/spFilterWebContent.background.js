// ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.background.js,v 1.17 2017/12/03 17:38:00 user Exp $ **** 
//

/**
 ** Dieses js-script laeuft als background-script laut manifest, so dass es immer aktiv ist
 ** und die WebRequests filtern kann
 **
 **  "background": {
 **      "scripts": ["spFilterWebContent.background.js"]
 **   },
 **
 ** Das background-script laeuft in einem leeren HTML-Dokument.
 **
 ** Seine Console kann man in Firefox unter
 **   about:debugging -> Add-ons -> <extension name> -> Debug
 ** sehen
 ** 
 **/

"use strict";
 
// Der Name des Moduls (u.a. fuer die Hilfsfunktion sp_printDebugLogMessage())
var SPMODULENAME = 'spFilterWebContentBackground';

// eine globale Variable, die die tab-id der aktiven console notiert
var myConsoleTabId = -1;

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


/*
 * Bei Klick auf das Icon der Extension soll ein neuer Tab erstellt werden, um in diesem Nachrichten anzuzuzeigen.
 * Der dafuer noetige Listener wird im Background-script einmalig beim Start angelegt.
 */

// Funktion definieren, die bei Klick aktiviert werden soll
browser.browserAction.onClicked.addListener(
    function()
    {
        // DEBUG-Meldung
        sp_printDebugLogMessage("onclicked STARTED");
	
        // Die URL der Webseite finden, in der die Nachrichten dargestellt werden sollen
        var n=browser.extension.getURL("spFilterWebContent.live.html");
	
        // neuen Tab erstellen und darin die Webseite fuer die Nachrichten anzeigen
	// Das Ergebnis con create wird ignoriert
	browser.tabs.create({url:n});
	
        sp_printDebugLogMessage("onclicked ENDED");
    } 
);

//
// Einen Listener registrieren, um auf Nachrichten reagieren zu koennen
//
browser.runtime.onMessage.addListener(handleMessage);
function handleMessage(request, sender, sendResponse) {

    sp_printDebugLogMessage("handleMessage() : START");
    sp_printDebugLogMessage("handleMessage() : myConsoleTabId  == " + myConsoleTabId );

    sp_printDebugLogObject("handleMessage.request",request);
    //sp_printDebugLogObject("handleMessage.sender",sender);
    
    if ( request["tabid"] != undefined ) {
	myConsoleTabId = request["tabid"];
    }
    sp_printDebugLogMessage("handleMessage() : myConsoleTabId  == " + myConsoleTabId );
    sp_printDebugLogMessage("handleMessage() : END");
}

//
// Einen Listener registrieren, um informiert zu werden, wenn ein Tab geschlossen wird
//
browser.tabs.onRemoved.addListener(handleRemoved);
function handleRemoved(tabId, removeInfo)
{
    sp_printDebugLogMessage("handleRemoved() : tabId == " + tabId);

    //
    // Falls der geschlossene Tab die aktive WebConsole ist, dies notieren
    //
    if ( tabId == myConsoleTabId ) {
	sp_printDebugLogMessage("handleRemoved() : active WebConsole closed.");
	myConsoleTabId = -1;
    }
}

// Die globale Variable mit den gespeicherten Werten vorbelegen
// und einen Listener registrieren, damit Aenderungen, die in der Option-Seite
// vorgenommen werden, bemerkt werden.
LoadOptions();
listenToStorageChanges();

/*
 * Listener registrieren, damit Webrequests manipuliert werden koennen
 */
spAdd_OnBeforeRequest_Listener_Block();
spAdd_OnBeforeSendHeaders_Listener_Block();
spAdd_OnHeadersReceived_Listener_Block();

/*
 * Besonderheit fuer Firefox 55 mit Android:
 *  -- Ein Klick auf den Menueintrag der Extension ruft die mittels
 *          Browser.browserAction.onClicked.addListener()
 *     definierte Callback-Funktion nicht auf.
 *
 *  -- Das Options-Menu gibt es nicht. Die Funktion 
 *             browser.runtime.openOptionsPage();
 *     ist nicht definiert.
 *
 * Daher werden die beiden HTML-Seiten beim Start der Extension automatisch gestartet.
 * Der Anwender hat keine Moeglichkeit, die beiden Seiten aufzurufen.
 *
 * Bemerkenswert: Sind im Quelltext die Eintraege
 *    console.log("spFilterWebContent : background-script starts");
 *    console.log("spFilterWebContent : navigator.userAgent == " + navigator.userAgent);
 *    console.log("spFilterWebContent : starting web-console");
 *    console.log("spFilterWebContent : starting options");
 * dann laedt Firefox beim Start das background-script nicht.
 *   Meldung: Loading failed for the <script> with source "moz-extension://...../spFilterWebContent.background.js
 * Bei Installation der Extension hingegen, funktiert alles.
 */

if ( (navigator.userAgent.indexOf("Android") > 0 ) && ( navigator.userAgent.indexOf("Firefox/55") > 0 ) ) {
    
    var t;
    t=browser.extension.getURL("spFilterWebContent.live.html");
    browser.tabs.create({url:t});

    // Die Options-Seite kann ueber die live-Seite aufgerufen werden, daher
    // muss diese beim Start nicht automatisch geoeffnet werden
    //t=browser.extension.getURL("spFilterWebContent.options.html");
    //browser.tabs.create({url:t});
}

/*
 * ==================================================================================================================
 *
 * Definition von Funktionen
 */

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
// **** START OF : $Id: function_Listener_OnBeforeRequest_Block.js,v 1.16 2020/03/15 10:39:47 user Exp $ **** 
//

/*
 * Die vom background-script genutzten Funktionen, um
 * gemaess Optionen des Anwenders WebRequests zu blockieren
 *
 * Die vom Listener aufgerufenen Funktionen wie
 *  isUnwantedResourceTypeURL()
 *  isUnwantedAllURL()
 *  isUnwantedFontFile()
 * liefern
 *  true  --> Der WebRequest soll       blockiert werden
 *  false --> Der WebRequest soll nicht blockiert werden
 *
 * Ausserdem schicken sie eine Nachricht, warum blockiert wird.
 * Diese Nachricht wird vom live-script entgegengenommen und angezeigt.
 */

// Funktion zur Registrierung des Listener
function spAdd_OnBeforeRequest_Listener_Block()
{
    // Registrierung eines Listener, der Webrequests vor dem Abschicken abfaengt
    browser.webRequest.onBeforeRequest.addListener(

	// Each addListener() call takes a mandatory callback function as the first parameter. "details" is an object
	spOnBeforeRequestListener_Block,
	
	// The webRequest.RequestFilter filter allows limiting the requests for which events are triggered in various dimensions
	// ResourceType: "main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", or "other"
	{
	    urls: ["<all_urls>"]
	},
	
	// If the optional opt_extraInfoSpec array contains the string 'blocking' (only allowed for specific events),
	// the callback function is handled synchronously. 
	["blocking"]
    );
}

// Funktion zum Entfernen des Listener
function spRemove_OnBeforeRequest_Listener_Block()
{
    browser.webRequest.onBeforeRequest.removeListener(spOnBeforeRequestListener_Block);
}

// Callback-Funktion des Listener
function spOnBeforeRequestListener_Block(details) {

    var mytestval;
    var myresult = false;
    
    sp_printDebugLogMessage("spOnBeforeRequestListener_Block(): START myConsoleTabId = " + myConsoleTabId );
    sp_printDebugLogObject("spOnBeforeRequestListener_Block() : details",details);

    /*
     * SCHRITT 0 : Zugriffe auf die eigenen Bestandteile der Webextension ist immer erlaubt
     *  Bei Chrome fuehrt in / bei "block URLs (all content types)" dazu, dass die Extension nicht mehr funktioniert
     *  und man damit die Option nicht mehr entfernen kann. Man muss dann im User-Profile die Daten loeschen
     *
     *  Damit dies nicht vorkommt, ist die URL auf die eigenen Daten immer erlaubt
     */
    {
	var myurl = details.url.toLowerCase();
	if ( myurl.indexOf(browser.extension.getURL("/")) >= 0 ) {
	    if (myConsoleTabId > 0 )
		sp_SendWebRequestAllowedMessage(details.requestId, "URL", "URL of extension always ALLOWED: ", "URL key=", browser.extension.getURL("/") );
	    return { cancel: false  };
	}
    }
    
    /*
     * SCHRITT 1 : ggf. einen redirect durchfuehren
     *
     * beachte: URLS sind case-sensitive, daher keine Umwandlung in lowercase
     *
     */
    mytestval = sp_CheckOptionMatchValue("myOptionRedirectAllURL", details.url);
    if ( mytestval.value == true ) {
	
	sp_printDebugLogMessage("source string found in URL");
	
	var mynewurl = details.url.replace(mytestval.matched_string,mytestval.option_value);
	sp_printDebugLogMessage("new URL is : " + mynewurl);
	
	// Damit auf der WebConsole die Nachricht erscheinen kann, diese Nachricht nun verschicken
	if (myConsoleTabId > 0 ) {
	    sp_SendWebRequestBlockedMessage(details.requestId, "URL", "URL REDIRECT: ", "URL key=", mytestval.matched_string);
	    sp_SendWebRequestBlockedMessage(details.requestId, "URL", "URL REDIRECT: ", "URL new=", mynewurl);
	}
	return { redirectUrl: mynewurl };
    }

    /*
     * SCHRITT 2 : Bestandteile zulassen oder blockieren -- basierend auf dem ResourceType (details.type) und der URL (details.url)
     */

    // (2a) : Test fuer "SecureURL"
    if ( isSecureURL(details) == true )  
	return { cancel: false };
    
    // (2b) : Test fuer "Allowed"
    if ( isAllowedResourceTypeURL(details) == true )  
	return { cancel: false };
    
    // (2c) : Test fuer "Blocked"
    if ( isBlockedResourceTypeURL(details) == true )  
	return { cancel: true };

    /*
     * SCHRITT 3 : FONT zulassen oder blockieren -- basierend auf der URL (details.url) und Namen des FONT
     */
    if ( details.type == "font" ) {
	if ( isUnwantedFontFile(details) == true )  
	    return { cancel: true };
    }
    
 
    /*
     * SCHRITT 4 : Bestandteile zulassen oder blockieren -- basierend auf der URL (details.url)
     */
    
    // (4a) : Test fuer "Allowed"
    if ( isAllowedAllURL(details) == true )  
	return { cancel: false };
    
    // (4b) : Test fuer "Blocked"
    if ( isBlockedAllURL(details) == true )
	return { cancel: true };
    
    //
    // SCHRITT 5 : Was bis zu dieser Stelle nicht bearbeitet wurde (erlaubt oder blockiert), ist erlaubt 
    //
    return { cancel: false };
}

/*
 * es folgen die Hilfsfunktionen
 */

//
// Fall (2a) : basierend Eigenschaft "Secure URL"
//            aktive Inhalte (d.h. scripts, cookies, referer), die bei sicherer Koniguration ausgeschaltet sind, sind zugelassen
// Die Funktion spOnBeforeRequestListener_Block() ist nur fuer script zustaendig.
// Die anderen Dinge sind Manipulation am Header
//
function isSecureURL(details){
    var urlname = details.url.toLowerCase();
    
    var my_all_array;
    var i;
    var mytypeL = details.type.toLowerCase();

    
    sp_printDebugLogMessage("isSecureURL STARTED: " + urlname);
    
    if ( (myOptionsStorage["myOptionSecureURL"] != undefined) && (myOptionsStorage["myOptionSecureURL"].length > 0) ) {
	
	//sp_printDebugLogMessage("isSecureURL  my_all_array=" + my_all_array);
	
	my_all_array = myOptionsStorage["myOptionSecureURL"].split("\n");
	
	//sp_printDebugLogMessage("isSecureURL my_all_array.length == " + my_all_array.length);
	for (i=0; i< my_all_array.length; i++) {
	    //sp_printDebugLogMessage("isSecureURL my_all_array[" + i + "] == " + my_all_array[i]);
	    if ( urlname.indexOf(my_all_array[i]) >= 0 ) {
		
		// Damit auf der WebConsole die Nachricht erscheinen kann, diese Nachricht nun verschicken
		if (myConsoleTabId > 0 )
		    sp_SendWebRequestAllowedMessage(details.requestId, "URL", "URL SECURE: ", "URL key=", my_all_array[i]);
		    
		if ( mytypeL == "script" ) {
		    sp_printDebugLogMessage("isSecureURL returns TRUE");
		    return true;
		}
	    } 
	}
    }
    
    sp_printDebugLogMessage("isSecureURL returns FALSE");
    return false;
}



//
// Fall (2b) : ALLOW basierend auf dem ResourceType details.type und der URL details.url
//
function isAllowedResourceTypeURL(details) {

    sp_printDebugLogMessage("isAllowedResourceTypeURL() STARTED: " + details.type + " -- " + details.url);
    
    var mytypeU = details.type.toUpperCase();
    var mytypeL = details.type.toLowerCase();
    
    // Aus dem Typ den Schluessel konstruieren, unter dem die Werte der Blockier-Option zu finden sind
    var mykey = myOptionsStorage_CreateKey_Allow_URL(mytypeL);
    
    // Aus der URL die interessanten Daten beziehen
    var myurl = details.url.toLowerCase();
    
    sp_printDebugLogMessage("isAllowedResourceTypeURL() : mykey = " + mykey);
    sp_printDebugLogObject("isAllowedResourceTypeURL() : myOptionsStorage[mykey]", myOptionsStorage[mykey]);

    // Pruefen, ob eine passende Option angegeben wurde
    var mytestval = sp_CheckOptionMatch(mykey, myurl);

    // Falls ja ...
    if ( mytestval.value == true ) {

	// Sofern eine WebConsole aktiv ist, eine Nachricht mit der Information ueber das Blockieren verschicken
	// damit dies in der WebConsole angezeigt wird
	if (myConsoleTabId > 0 )
	    sp_SendWebRequestAllowedMessage(details.requestId, mytypeU, mytypeU + " ALLOWED: ", "URL key=", mytestval.matched_string);
	
	// ... weitere Tests abbrechen und TRUE zurueckliefern
	sp_printDebugLogMessage("isAllowedResourceTypeURL() returns TRUE");
	return true;
    }
    
    // Alle Tests waren negativ
    sp_printDebugLogMessage("isAllowedResourceTypeURL() returns FALSE");
    return false;
}

//
// Fall (2c) : BLOCK basierend auf dem ResourceType details.type und der URL details.url
//
function isBlockedResourceTypeURL(details) {

    sp_printDebugLogMessage("isBlockedResourceTypeURL() STARTED: " + details.type + " -- " + details.url);
    
    var mytypeU = details.type.toUpperCase();
    var mytypeL = details.type.toLowerCase();
    
    // Aus dem Typ den Schluessel konstruieren, unter dem die Werte der Blockier-Option zu finden sind
    var mykey = myOptionsStorage_CreateKey_Block_URL(mytypeL);
    
    // Aus der URL die interessanten Daten beziehen
    var myurl = details.url.toLowerCase();
    
    sp_printDebugLogMessage("isBlockedResourceTypeURL() : mykey = " + mykey);
    sp_printDebugLogObject("isBlockedResourceTypeURL() : myOptionsStorage[mykey]", myOptionsStorage[mykey]);
    
    // Pruefen, ob eine passende Option angegeben wurde
    var mytestval = sp_CheckOptionMatch(mykey, myurl);

    // Falls ja ...
    if ( mytestval.value == true ) {
	
	// Sofern eine WebConsole aktiv ist, eine Nachricht mit der Information ueber das Blockieren verschicken
	// damit dies in der WebConsole angezeigt wird
	if (myConsoleTabId > 0 )
	    sp_SendWebRequestBlockedMessage(details.requestId, mytypeU, mytypeU + " BLOCKED: ", "URL key=", mytestval.matched_string);
	
	// ... weitere Tests abbrechen und TRUE zurueckliefern
	sp_printDebugLogMessage("isBlockedResourceTypeURL() returns TRUE");
	return true;
    }
    
    // Alle Tests waren negativ
    sp_printDebugLogMessage("isBlockedResourceTypeURL() returns FALSE");
    return false;
}

//
// Fall (3) : basierend auf dem Namen eines Zeichensatzes
//
// Im Gegensatz zu den url-basierten Blockierregeln wird beim Namen auf Gross-Kleinschreibung geachtet
//
// The indexOf() method returns the position of the first occurrence of a specified value in a string.
// This method returns -1 if the value to search for never occurs.
//
function isUnwantedFontFile(details){

    var my_font_array;
    var i;
    var filename;
    var my_array;
    var mykey;
    var detailsurl = details.url;
    
    sp_printDebugLogMessage("isUnwantedFontFile() STARTED: " + detailsurl);
    
    mykey = myOptionsStorage_CreateKey_Block_NAME("font");
    
    if ( (myOptionsStorage[mykey] != undefined) && (myOptionsStorage[mykey].length > 0) ) {
	
	
	my_array = detailsurl.split("/");
	filename = my_array[my_array.length - 1];
	//sp_printDebugLogMessage("isUnwantedFontFile() : filename = " + filename);
	
	my_font_array = myOptionsStorage[mykey].split("/");
	//sp_printDebugLogMessage("isUnwantedFontFile my_font_array=" + my_font_array);
	//sp_printDebugLogMessage("isUnwantedFontFile my_font_array.length == " + my_font_array.length);

	for (i=0; i< my_font_array.length; i++) {
            if ( filename.indexOf(my_font_array[i]) >= 0 ) {

		// Damit auf der WebConsole die Nachricht erscheinen kann, diese Nachricht nun verschicken
		if (myConsoleTabId > 0 )
		    sp_SendWebRequestBlockedMessage(details.requestId, "FONT", "FONT BLOCKED: ", "Name key=", my_font_array[i]);
		
		sp_printDebugLogMessage("isUnwantedFontFile returns TRUE");
		return true;
            } 
	} 
    }
    
    sp_printDebugLogMessage("isUnwantedFontFile returns FALSE");
    return false;
}



//
// Fall (4a) : ALLOW basierend auf der URL unabhaengig vom ResourceType details.type
//

function isAllowedAllURL(details)
{
    var urlname = details.url.toLowerCase();

    var my_all_array;
    var i;
    
    sp_printDebugLogMessage("isAllowedAllURL STARTED: " + urlname);
    
    if ( (myOptionsStorage["myOptionAllowAllURL"] != undefined) && (myOptionsStorage["myOptionAllowAllURL"].length > 0) ) {
	
	//sp_printDebugLogMessage("isAllowedAllURL my_all_array=" + my_all_array);
	
	my_all_array = myOptionsStorage["myOptionAllowAllURL"].split("\n");
	
	//sp_printDebugLogMessage("isAllowedAllURL my_all_array.length == " + my_all_array.length);
	for (i=0; i< my_all_array.length; i++) {
            //sp_printDebugLogMessage("isAllowedAllURL my_all_array[" + i + "] == " + my_all_array[i]);
            if ( urlname.indexOf(my_all_array[i]) >= 0 ) {

		// Damit auf der WebConsole die Nachricht erscheinen kann, diese Nachricht nun verschicken
		if (myConsoleTabId > 0 )
		    sp_SendWebRequestAllowedMessage(details.requestId, "URL", "URL ALLOWED: ", "URL key=", my_all_array[i]);

		sp_printDebugLogMessage("isAllowedAllURL returns TRUE");
		return true;
            }
	} 
    }
    
    sp_printDebugLogMessage("isAllowedAllURL returns FALSE");
    return false;
}

//
// Fall (4b) : BLOCK basierend auf der URL unabhaengig vom ResourceType details.type
//
function isBlockedAllURL(details)
{
    var urlname = details.url.toLowerCase();

    var my_all_array;
    var i;
    
    sp_printDebugLogMessage("isBlockedAllURL STARTED: " + urlname);
    
    if ( (myOptionsStorage["myOptionBlockAllURL"] != undefined) && (myOptionsStorage["myOptionBlockAllURL"].length > 0) ) {
	
	//sp_printDebugLogMessage("isBlockedAllURL my_all_array=" + my_all_array);
	
	my_all_array = myOptionsStorage["myOptionBlockAllURL"].split("\n");
	
	//sp_printDebugLogMessage("isBlockedAllURL my_all_array.length == " + my_all_array.length);
	for (i=0; i< my_all_array.length; i++) {
            //sp_printDebugLogMessage("isBlockedAllURL my_all_array[" + i + "] == " + my_all_array[i]);
            if ( urlname.indexOf(my_all_array[i]) >= 0 ) {

		// Damit auf der WebConsole die Nachricht erscheinen kann, diese Nachricht nun verschicken
		if (myConsoleTabId > 0 )
		    sp_SendWebRequestBlockedMessage(details.requestId, "URL", "URL BLOCKED: ", "URL key=", my_all_array[i]);

		sp_printDebugLogMessage("isBlockedAllURL returns TRUE");
		return true;
            }
	} 
    }
    
    sp_printDebugLogMessage("isBlockedAllURL returns FALSE");
    return false;
}

//
// Funktion, um eine Meldung zu verschicken, was warum blockiert wird
// Die Meldung wird vom live-script empfangen und mit einem
//   {response: "ok"}
// quittiert.
// Falls die Antwort nicht kommt, ist keine WebConsole aktiv
// In diesem Fall wird die myConsoleTabId auf -1 gesetzt
// damit keine weiteren Meldungen verschickt werden
//
function sp_SendWebRequestBlockedMessage(RequestId, type, part01, part02, part03)
{

    // Wenn der Empfaenger keine Antwort schickt, ist message == undefined 
    function handleResponse(message) {
	if ( message == undefined ) {
	    console.log("sp_SendWebRequestBlockedMessage() : handleResponse() : no answer received from spConsole in tab " + myConsoleTabId );
	    console.log("sp_SendWebRequestBlockedMessage() : handleResponse() : disabling messaging.");
	    myConsoleTabId = -1;
	}
    }
    
    function handleError(error) {
	console.log("sp_SendWebRequestBlockedMessage() : handleError() : ");
	console.log(error);
    }
    var mymsgtype = "spBlockedReport";
    // ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.background.js__SendMessage.js,v 1.2 2018/01/20 11:16:23 user Exp $ **** 
//

// Implementierung fuer Firefox
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage

   var sending = browser.runtime.sendMessage( { msgtype : mymsgtype, type: type, RequestId : RequestId, part01: part01, part02 : part02, part03 : part03} );
sending.then(handleResponse, handleError);

//
// **** END OF   : $Id: spFilterWebContent.background.js__SendMessage.js,v 1.2 2018/01/20 11:16:23 user Exp $ **** 
// ================================================================================================================================

    
}

//
// Funktion, um eine Meldung zu verschicken, was warum erlaubt wird
// Die Meldung wird vom live-script empfangen und mit einem
//   {response: "ok"}
// quittiert.
// Falls die Antwort nicht kommt, ist keine WebConsole aktiv
// In diesem Fall wird die myConsoleTabId auf -1 gesetzt
// damit keine weiteren Meldungen verschickt werden
//
function sp_SendWebRequestAllowedMessage(RequestId, type, part01, part02, part03)
{

    // Wenn der Empfaenger keine Antwort schickt, ist message == undefined 
    function handleResponse(message) {
	if ( message == undefined ) {
	    console.log("sp_SendWebRequestAllowedMessage() : handleResponse() : no answer received from spConsole in tab " + myConsoleTabId );
	    console.log("sp_SendWebRequestAllowedMessage() : handleResponse() : disabling messaging.");
	    myConsoleTabId = -1;
	}
    }
    
    function handleError(error) {
	console.log("sp_SendWebRequestAllowedMessage() : handleError() : ");
	console.log(error);
    }
     var mymsgtype = "spAllowedReport";
    // ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.background.js__SendMessage.js,v 1.2 2018/01/20 11:16:23 user Exp $ **** 
//

// Implementierung fuer Firefox
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage

   var sending = browser.runtime.sendMessage( { msgtype : mymsgtype, type: type, RequestId : RequestId, part01: part01, part02 : part02, part03 : part03} );
sending.then(handleResponse, handleError);

//
// **** END OF   : $Id: spFilterWebContent.background.js__SendMessage.js,v 1.2 2018/01/20 11:16:23 user Exp $ **** 
// ================================================================================================================================

    
}

//
// **** END OF   : $Id: function_Listener_OnBeforeRequest_Block.js,v 1.16 2020/03/15 10:39:47 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnBeforeSendHeaders_Block.js,v 1.11 2020/03/15 12:35:04 user Exp $ **** 
//

/*
 * Die vom background-script genutzten Funktionen, um
 * gemaess Optionen des Anwenders WebRequests zu blockieren
 *
 * Die vom Listener aufgerufenen Funktionen wie
 *  isUnwantedRefererURL()
 * liefern
 *  true  --> Der WebRequest soll       blockiert werden
 *  false --> Der WebRequest soll nicht blockiert werden
 *
 * Ausserdem wird eine Nachricht verschickt, warum blockiert wird.
 * Diese Nachricht wird vom live-script entgegengenommen und angezeigt.
 */


// Funktion zur Registrierung des Listener
function spAdd_OnBeforeSendHeaders_Listener_Block()
{
    // onBeforeSendHeaders
    browser.webRequest.onBeforeSendHeaders.addListener(
	spOnBeforeSendHeadersListener_Block,
	{
	    urls: ["<all_urls>"]
	},
	["blocking","requestHeaders"]
	
    );
}

// Funktion zum Entfernen des Listener
function spRemove_OnBeforeSendHeaders_Listener_Block()
{
    browser.webRequest.onBeforeSendHeaders.removeListener(spOnBeforeSendHeadersListener_Block);
}


// Callback-Funktion des Listener
function spOnBeforeSendHeadersListener_Block(details) {
	
    //sp_printDebugLogMessage("onBeforeSendHeaders: " + details.requestId + " " + details.url);

    var i;
    var retval

    /*
     * Teil (A) : Entfernen des Referer
     */
    
    retval = isUnwantedRefererURL(details.url.toLowerCase());
    
    // Falls fuer die URL des WebRequest der Referer aus den Request-Headers entfernt werden soll ...
    if (retval.value == true) {

	// .. die Request-Header durchgehen ...
        for (i=0;i<details.requestHeaders.length;i++) {

	    // ... Falls der Referer gefunden wurde ...
	    if ( details.requestHeaders[i].name.toLowerCase() == "referer") {


		// Sofern eine WebConsole aktiv ist, eine Nachricht mit der Information ueber das Blockieren verschicken
		// damit dies in der WebConsole angezeigt wird
		if (myConsoleTabId > 0 )
		    sp_SendWebRequestBlockedMessage(details.requestId, "REFERER", "Referer BLOCKED: ", details.requestHeaders[i].value +", URL key=", retval.option);

		//
		// ... den Referer entfernen
		//
		//The splice() method adds/removes items to/from an array, and returns the removed item(s).
		// index   = An integer that specifies at what position to add/remove items
		// howmany = The number of items to be removed.
		details.requestHeaders.splice(i, 1);

		break;
	    }
        }
    }


    /*
     * Teil (B) : Entfernen der Cookies
     */
    retval = isUnwantedCookiesURL(details.url.toLowerCase());
    
    // Falls fuer die URL des WebRequest Cookies aus den Request-Headers entfernt werden sollen ...
    if (retval.value == true) {

	// .. die Request-Header durchgehen ...
        for (i = details.requestHeaders.length-1; i>=0; i--) {
	    
	    // ... Falls ein Cookie gefunden wurde ...
	    if ( details.requestHeaders[i].name.toLowerCase() == "cookie") {


		// Sofern eine WebConsole aktiv ist, eine Nachricht mit der Information ueber das Blockieren verschicken
		// damit dies in der WebConsole angezeigt wird
		if (myConsoleTabId > 0 )
		    sp_SendWebRequestBlockedMessage(details.requestId, "COOKIES", "Request Cookies BLOCKED: ", details.requestHeaders[i].value +", URL key=", retval.option);

		//
		// ... Cookie entfernen
		//
		//The splice() method adds/removes items to/from an array, and returns the removed item(s).
		// index   = An integer that specifies at what position to add/remove items
		// howmany = The number of items to be removed.
		details.requestHeaders.splice(i, 1);
	    }
        }
    }

    /*
     * Teil (C) : Austauschen des User Agent
     */
    retval = isUnwantedUserAgentURL(details.url.toLowerCase());
    // Falls fuer die URL der User Agent ausgetauscht werden soll ...
    if (retval.value == true) {
	
	// .. die Request-Header durchgehen ...
        for (i=0;i<details.requestHeaders.length;i++) {
	    
	    // ... Falls der User Agent gefunden wurde ...
	    if ( details.requestHeaders[i].name.toLowerCase() == "user-agent") {

		// diesen austauschen
		details.requestHeaders[i].value = myOptionsStorage["myOptionChangeUserAgent"];
		break;
	    }
	}
    }
    

    
    //sp_printDebugLogMessage("onBeforeSendHeaders ENDED");
    return {requestHeaders: details.requestHeaders};
    
}

/*
 * es folgen die Hilfsfunktionen
 */
function isUnwantedRefererURL(urlname){
    
    var my_referer_array;
    var i;
    
    //sp_printDebugLogMessage("isUnwantedRefererURL STARTED : " + urlname);

    /*
     * Schritt 1:
     * Liste der erlaubten URLs durchsehen
     */
    
    // Wenn die Option einen vom Anwender hinterlegten Wert hat ...
    if ( (myOptionsStorage["myOptionSecureURL"] != undefined) && (myOptionsStorage["myOptionSecureURL"].length > 0) ) {

	//sp_printDebugLogMessage("myOptionSecureURL OPTION : " + myOptionsStorage["myOptionSecureURL"]);

	
	// .. diesen Wert in seine Bestandteile zerlegen ...
	my_referer_array = myOptionsStorage["myOptionSecureURL"].split("\n");

	// ... und die einzelnen Bestandteile durchgehen
	for (i=0; i< my_referer_array.length; i++) {
	    // falls die URL des WebRequest den Bestandteil enthaelt ...
            if ( urlname.indexOf(my_referer_array[i]) >= 0 ) {
		
		//sp_printDebugLogMessage("myOptionSecureURL returns FALSE");

		// .. mitteilen, dass der nicht Referer entfernt werden soll
		return { value: false };
            }
	}
    }

    // Wenn die Option einen vom Anwender hinterlegten Wert hat ...
    if ( (myOptionsStorage["myOptionAllowRefererURL"] != undefined) && (myOptionsStorage["myOptionAllowRefererURL"].length > 0) ) {

	//sp_printDebugLogMessage("isUnwantedRefererURL OPTION : " + myOptionsStorage["myOptionAllowkRefererURL"]);

	
	// .. diesen Wert in seine Bestandteile zerlegen ...
	my_referer_array = myOptionsStorage["myOptionAllowRefererURL"].split("\n");

	// ... und die einzelnen Bestandteile durchgehen
	for (i=0; i< my_referer_array.length; i++) {
	    // falls die URL des WebRequest den Bestandteil enthaelt ...
            if ( urlname.indexOf(my_referer_array[i]) >= 0 ) {
		
		//sp_printDebugLogMessage("isUnwantedRefererURL returns FALSE");

		// .. mitteilen, dass der nicht Referer entfernt werden soll
		return { value: false };
            }
	}
    }
    
    /*
     * Schritt 2:
     * Liste der verbotenen URLs durchsehen
     */
    // Wenn die Option einen vom Anwender hinterlegten Wert hat ...
    if ( (myOptionsStorage["myOptionBlockRefererURL"] != undefined) && (myOptionsStorage["myOptionBlockRefererURL"].length > 0) ) {

	//sp_printDebugLogMessage("isUnwantedRefererURL OPTION : " + myOptionsStorage["myOptionBlockRefererURL"]);

	
	// .. diesen Wert in seine Bestandteile zerlegen ...
	my_referer_array = myOptionsStorage["myOptionBlockRefererURL"].split("\n");

	// ... und die einzelnen Bestandteile durchgehen
	for (i=0; i< my_referer_array.length; i++) {
	    // falls die URL des WebRequest den Bestandteil enthaelt ...
            if ( urlname.indexOf(my_referer_array[i]) >= 0 ) {
		
		//sp_printDebugLogMessage("isUnwantedRefererURL returns TRUE");

		// .. mitteilen, dass der Referer entfernt werden soll
		return { value: true, option : my_referer_array[i] };
            }
	}
    }
    
    //sp_printDebugLogMessage("isUnwantedRefererURL returns FALSE");
    return { value: false };
    
}

function isUnwantedCookiesURL(urlname){
    
    var my_cookies_array;
    var i;
    
    sp_printDebugLogMessage("isUnwantedCookiesURL STARTED : " + urlname);

    /*
     * Schritt 1:
     * Liste der erlaubten URLs durchsehen
     */
    
    // Wenn die Option einen vom Anwender hinterlegten Wert hat ...
    if ( (myOptionsStorage["myOptionSecureURL"] != undefined) && (myOptionsStorage["myOptionSecureURL"].length > 0) ) {

	sp_printDebugLogMessage("myOptionSecureURL OPTION : " + myOptionsStorage["myOptionSecureURL"]);
	
	// .. diesen Wert in seine Bestandteile zerlegen ...
	my_cookies_array = myOptionsStorage["myOptionSecureURL"].split("\n");

	// ... und die einzelnen Bestandteile durchgehen
	for (i=0; i< my_cookies_array.length; i++) {
	    // falls die URL des WebRequest den Bestandteil enthaelt ...
            if ( urlname.indexOf(my_cookies_array[i]) >= 0 ) {
		
		sp_printDebugLogMessage("isUnwantedCookiesURL returns FALSE");

		// .. mitteilen, dass Cookies nicht entfernt werden sollen
		return { value: false };
            }
	}
    }

    // Wenn die Option einen vom Anwender hinterlegten Wert hat ...
    if ( (myOptionsStorage["myOptionAllowCookiesURL"] != undefined) && (myOptionsStorage["myOptionAllowCookiesURL"].length > 0) ) {

	sp_printDebugLogMessage("isUnwantedCookiesURL OPTION : " + myOptionsStorage["myOptionAllowCookiesURL"]);
	
	// .. diesen Wert in seine Bestandteile zerlegen ...
	my_cookies_array = myOptionsStorage["myOptionAllowCookiesURL"].split("\n");

	// ... und die einzelnen Bestandteile durchgehen
	for (i=0; i< my_cookies_array.length; i++) {
	    // falls die URL des WebRequest den Bestandteil enthaelt ...
            if ( urlname.indexOf(my_cookies_array[i]) >= 0 ) {
		
		sp_printDebugLogMessage("isUnwantedCookiesURL returns FALSE");

		// .. mitteilen, dass Cookies nicht entfernt werden sollen
		return { value: false };
            }
	}
    }

    /*
     * Schritt 2:
     * Liste der verbotenen URLs durchsehen
     */
    // Wenn die Option einen vom Anwender hinterlegten Wert hat ...
    if ( (myOptionsStorage["myOptionBlockCookiesURL"] != undefined) && (myOptionsStorage["myOptionBlockCookiesURL"].length > 0) ) {

	sp_printDebugLogMessage("isUnwantedCookiesURL OPTION : " + myOptionsStorage["myOptionBlockCookiesURL"]);
	
	// .. diesen Wert in seine Bestandteile zerlegen ...
	my_cookies_array = myOptionsStorage["myOptionBlockCookiesURL"].split("\n");

	// ... und die einzelnen Bestandteile durchgehen
	for (i=0; i< my_cookies_array.length; i++) {
	    // falls die URL des WebRequest den Bestandteil enthaelt ...
            if ( urlname.indexOf(my_cookies_array[i]) >= 0 ) {
		
		sp_printDebugLogMessage("isUnwantedCookiesURL returns TRUE");

		// .. mitteilen, dass Cookies entfernt werden sollen
		return { value: true, option : my_cookies_array[i] };
            }
	}
    }
    
    sp_printDebugLogMessage("isUnwantedCookiesURL returns FALSE");
    return { value: false };
    
}

function isUnwantedUserAgentURL(urlname){
    
    var my_UserAgent_array;
    var i;
    
    //sp_printDebugLogMessage("isUnwantedUserAgentURL STARTED : " + urlname);
    
    // Wenn die Option einen vom Anwender hinterlegten Wert hat ...
    if ( (myOptionsStorage["myOptionChangeUserAgentURL"] != undefined) && (myOptionsStorage["myOptionChangeUserAgentURL"].length > 0) ) {

	//sp_printDebugLogMessage("isUnwantedUserAgentURL OPTION : " + myOptionsStorage["myOptionChangeUserAgentURL"]);
	
	// .. diesen Wert in seine Bestandteile zerlegen ...
	my_UserAgent_array = myOptionsStorage["myOptionChangeUserAgentURL"].split("\n");

	// ... und die einzelnen Bestandteile durchgehen
	for (i=0; i< my_UserAgent_array.length; i++) {
	    // falls die URL des WebRequest den Bestandteil enthaelt ...
            if ( urlname.indexOf(my_UserAgent_array[i]) >= 0 ) {
		
		//sp_printDebugLogMessage("isUnwantedUserAgentURL returns TRUE");

		// .. mitteilen, dass UserAgent entfernt werden sollen
		return { value: true, option : my_UserAgent_array[i] };
            }
	}
    }
    
    //sp_printDebugLogMessage("isUnwantedUserAgentURL returns FALSE");
    return { value: false };
    
}


//
// **** END OF   : $Id: function_Listener_OnBeforeSendHeaders_Block.js,v 1.11 2020/03/15 12:35:04 user Exp $ **** 
// ================================================================================================================================

// ================================================================================================================================
// **** START OF : $Id: function_Listener_OnHeadersReceived_Block.js,v 1.9 2019/11/24 07:50:47 user Exp $ **** 
//

// Funktion zur Registrierung des Listener
function spAdd_OnHeadersReceived_Listener_Block()
{
    // onHeadersReceived
    browser.webRequest.onHeadersReceived.addListener(
	spOnHeadersReceivedListener_Block,
	{
	    urls: ["<all_urls>"]
	},
	["blocking","responseHeaders"]
	
    );
}

// Funktion zum Entfernen des Listener
function spRemove_OnHeadersReceived_Listener_Block()
{
    browser.webRequest.onHeadersReceived.removeListener(spOnHeadersReceivedListener_Block);
}

// Callback-Funktion des Listener
function spOnHeadersReceivedListener_Block(details) {

    var retval;
    var i;
    
    sp_printDebugLogMessage("onHeadersReceived: " + details.requestId + " " + details.url);
    
    /*
     * SCHRITT 1 : Cookies entfernen, falls gewuenscht
     */
    retval = isUnwantedCookiesResponseURL(details.url.toLowerCase());
    
    if ( retval.value == true ) {
	
	// .. die Response-Header durchgehen ...
        for (i = details.responseHeaders.length-1; i>=0; i--) {
	    
	    // ... Falls ein Cookie gefunden wurde ...
	    if ( details.responseHeaders[i].name.toLowerCase() == "set-cookie") {
		
		// Sofern eine WebConsole aktiv ist, eine Nachricht mit der Information ueber das Blockieren verschicken
		// damit dies in der WebConsole angezeigt wird
		if (myConsoleTabId > 0 )
		    sp_SendWebRequestBlockedMessage(details.requestId, "COOKIES", "Response Cookies BLOCKED: ",
						    details.responseHeaders[i].value +", URL key=", retval.option);
		
		//
		// ... Cookie entfernen
		//
		//The splice() method adds/removes items to/from an array, and returns the removed item(s).
		// index   = An integer that specifies at what position to add/remove items
		// howmany = The number of items to be removed.
		details.responseHeaders.splice(i, 1);
	    }
        }
    }
    
    
    /*
     * SCHRITT 2 : CSP-Header einfuegen, falls gewuenscht
     */
    
    // Festellen, welchen CSP-Header der Anwender wuenscht
    retval = sp_get_custom_CSP_header(details);
    
    if ( retval != "__sp_none__" ) {
	
	// .. die Response-Header durchgehen ...
        for (i=0;i<details.responseHeaders.length;i++) {
	    
	    // ... Falls ein CSP header gefunden wurde ...
	    if ( details.responseHeaders[i].name.toLowerCase() == "content-security-policy") {
		
		// diesen entfernen
		details.responseHeaders.splice(i, 1);
		
		break;
	    }
	}
	
	// Nun den gewuenschten CSP Header einfuegen
	details.responseHeaders.push({ name:"Content-Security-Policy", value:retval } );
	sp_printDebugLogObject(details.responseHeaders);
    }
    
    // Die neuen Response Header als Wert der Funktion zurueckgeben.
    return {responseHeaders:details.responseHeaders };
}

function isUnwantedCookiesResponseURL(urlname){
    
    var my_cookies_array;
    var i;
    var testval;
    
    sp_printDebugLogMessage("isUnwantedCookiesResponseURL STARTED : " + urlname);

    /*
     * Schritt 1:
     * Liste der erlaubten URLs durchsehen
     */
    testval = sp_CheckOptionMatch("myOptionSecureURL", urlname);
    if (  testval.value == true ) 
	return { value: false };

    testval = sp_CheckOptionMatch("myOptionAllowCookiesResponseURL", urlname);
    if (  testval.value == true ) 
	return { value: false };
    
    /*
     * Schritt 2:
     * Liste der verbotenen URLs durchsehen
     */
    testval = sp_CheckOptionMatch("myOptionBlockCookiesResponseURL", urlname);
    if (  testval.value == true )
	return { value: true , option : testval.matched_string };
    
    sp_printDebugLogMessage("isUnwantedCookiesResponseURL returns FALSE");
    return { value: false };
    
}

function sp_get_custom_CSP_header(details)
{
    var mytypeU = details.type.toUpperCase();
    var myurl = details.url.toLowerCase();
    
    var retval = "";
    
    // CSP ist nur bei MAIN_FRAME und SUB_FRAME sinnvoll
    if ( (mytypeU == "MAIN_FRAME") || (mytypeU == "SUB_FRAME") ) {

	var testval;
	
	/*
	 * Schritt 1 : ist die URL auf der white list oder secure, dann keinen CSP eintragen lassen
	 */
	testval = sp_CheckOptionMatch("myOptionSecureURL", myurl)
	if ( testval.value == true ) 
	    return "__sp_none__";
	
	testval = sp_CheckOptionMatch("myOptionNoCSPHeaderURL", myurl)
	if ( testval.value == true ) 
	    return "__sp_none__";
	
	
	/*
	 * Schritt 2 : ist die URL auf der black list, dann einen CSP eintragen lassen
	 */
	testval = sp_CheckOptionMatchValue("myOptionSetCSPHeaderURL", myurl)
	if ( testval.value == true ) {
	    
	    // Meldung ausgeben
	    if (myConsoleTabId > 0 )
		sp_SendWebRequestBlockedMessage(details.requestId, mytypeU, "CSP Response Header inserted : ", "URL key = ", testval.matched_string);

	    // gewuenschten CSP-Header zurueckliefern
	    return testval.option_value
	}
	
    } // if ( (mytypeU == "MAIN_FRAME") || (mytypeU == "SUB_FRAME") ) {

    // Standwert zurueckliefern : kein CSP Header gewuenscht
    return "__sp_none__";
   
}


//
// **** END OF   : $Id: function_Listener_OnHeadersReceived_Block.js,v 1.9 2019/11/24 07:50:47 user Exp $ **** 
// ================================================================================================================================


//
// **** END OF   : $Id: spFilterWebContent.background.js,v 1.17 2017/12/03 17:38:00 user Exp $ **** 
// ================================================================================================================================
