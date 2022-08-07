// ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.options.js,v 1.21 2022/08/06 19:37:56 user Exp $ **** 
//

/**
 ** Dieses Module dient der Aenderung und Speicherung der Optionen
 ** Benutzt wird bei Firefox:
 **      https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local
 **
 **/
"use strict";

/*
 */
var SPMODULENAME = 'spFilterWebContentOptions';

// eine globale Variable, die die eigene Tab-ID notiert
var myOwnTabId = -1;

// eine globale Variable, die den Index der Regel fuer Schriftgroesse und -family notiert
var myOwnCSSRuleIndex = -1;

/*
 * Definition der globalen Object-Variablen, deren Schluessel gleichzeitig
 * die IDs der Elemente in der Option-HTML-Seite sind
 */
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
    if ( "setIcon" in chrome.browserAction ) {
	if ( is_secure == true ) {
	    chrome.browserAction.setIcon({path: {16: "spFilterWebContent.secure.logo.016.png",
						  32: "spFilterWebContent.secure.logo.032.png",
						  64: "spFilterWebContent.secure.logo.064.png"}});
	}
	else {
	    chrome.browserAction.setIcon({path: {16: "spFilterWebContent.logo.016.png",
						  32: "spFilterWebContent.logo.032.png",
						  64: "spFilterWebContent.logo.064.png"}});
	}
    }
    
    return is_secure;
}

//
// **** END OF : $Id: vardef.js,v 1.36 2020/03/28 11:06:10 user Exp $ **** 
// ================================================================================================================================


//
// Die Ueberschrift anpassen, eigene Tab-ID notieren
// und die anderen Tabs beanrichtigen, dass sie sich auf inaktiv setzen sollen
//
{
// ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.options.js__GetCurrentTab.js,v 1.1 2017/09/03 11:06:49 user Exp $ **** 
//

// Implementierung fuer chrome
// https://developer.chrome.com/extensions/tabs

chrome.tabs.getCurrent(spOnGotTabCurrent);

//
// **** END OF   : $Id: spFilterWebContent.options.js__GetCurrentTab.js,v 1.1 2017/09/03 11:06:49 user Exp $ **** 
// ================================================================================================================================

    
    function spOnGotTabCurrent(tabInfo) {

	// eigene tab-id notieren
	myOwnTabId = tabInfo.id;

	//
	// die internen links in der options-page funktionieren nicht,
	// wenn die Optionen bei Firefox in "about:addons" angezeigt werden.
	// Das Inhaltsverzeichnis daher in diesem Fall entfernen
	// Um tabInfo.url sehen zu koennen, ist permission "tabs" notwendig
	//
	if ( tabInfo.url == "about:addons" ) {
	    var element = document.getElementById("sp_Table_of_Contents");
	    element.parentNode.removeChild(element);
	}
    }
    
    function spOnErrorTabCurrent(error) {
    }
}

// Funktion zum Speichern der Optionen
function SaveOptions(myevent) {

    var mykeys;
    var mykey;
    var i;
    
    
    // Die Werte aus den Eingabefeldern der Options-Seite werden in die globale Variable eingetragen ....

    // Liste der Schluessel aus dem Options-Storage holen
    mykeys = Object.keys(myOptionsStorage);

    // Die Schluessel einzeln durchgehen und ihre neuen Werte eintragen
    for ( i=0;i<mykeys.length;i++ ) {
	
	mykey = mykeys[i];

	if ( mykey != "myOptionChangeUserAgentStandardValues" ) {
	    var mystring = sp_sanitize_option_string(document.getElementById(mykey).value,"\n");
	    
	    // Die Header- und URL-Optionen werden in Kleinbuchstaben uebernommen
	    // Ausnahme sind die redirect-URLs
	    if ( (mykey != "myOptionRedirectAllURL") && ((mykey.substr(mykey.length - 3) == "URL") || (mykey.substr(mykey.length - 7) == "Headers")) )
		myOptionsStorage[mykey] = mystring.toLowerCase();	
	    // alle anderen Werte werden nicht veraendert
	    else
		myOptionsStorage[mykey] = mystring;	
	
	    document.getElementById(mykey).style.color = "black";
	}
    }
    
    // ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.options__SaveOptions.js,v 1.1 2017/08/24 10:04:36 user Exp $ **** 
//

// Implementierung fuer Chrome

// Die Werte der Globalen Variablen werden dauerhaft gespeichert
// Achtung: das set() ist asynchron
// https://developer.chrome.com/extensions/storage
//  Callback on success, or on failure (in which case runtime.lastError will be set).

chrome.storage.local.set({myOptionsSaved : myOptionsStorage}, ShowOptions);

//
// **** END OF   : $Id: spFilterWebContent.options__SaveOptions.js,v 1.1 2017/08/24 10:04:36 user Exp $ **** 
// ================================================================================================================================


    // Nun die gespeicherten Optionen wieder laden und anzeigen
    LoadOptions();
    
}

// Callback-Funktion fuer chrome.storage.local.set
function SaveOptionsOnError(error) {
}

// Hilfsfunktion, die leere Zeilen und Leerzeichen an Anfang und Ende entfernt
// ebenso mehrfache Leerzeichen in jeder Zeile
function sp_sanitize_option_string(mystring, mylineseparator)
{
    var i;
    var myresult;
    
    
    var myarray  = mystring.split(mylineseparator);
    for (i=myarray.length - 1; i >= 0; i--) {
	if ( (myarray[i].length == 0) || (myarray[i] == " ")  ) {
	    myarray.splice(i,1);
	}
	else {
	    myarray[i] = myarray[i].trim();
	    myarray[i] = myarray[i].replace(/ +/g," ");
	}
    }	
    
    myresult = myarray.join(mylineseparator);
    
    return myresult;
}

//
// Diese Funktion zeigt die Werte in der Option-Page an
// Die Globale Variable "myOptionsStorage" muss mit Werten gefuellt sein
// Die Namen der Attribute der globalen Variablen sind gleichzeitig
// die IDs der zugehoerigen Felder in der Web-Seite
function ShowOptions() {


    if ( myOptionsStorage == undefined ) {
    }
    else {

	var mykeys;
	var mykey;
	var i;
	var myobject;
	
	// Die Liste der Attribute aus dem Speicher beschaffen
	mykeys = Object.keys(myOptionsStorage);

	// Die einzelnen Attribute durchgehen und ihre Werte in der Web-Seite eintragen
	// sofern es ein Feld mit der passenden ID gibt
	for ( i=0;i<mykeys.length;i++ ) {

	    mykey = mykeys[i];
	    myobject = document.getElementById(mykey);
	    
	    // Falls der Schluesse in der Web-Seite nicht gefunden wird, dann dies ignorieren
	    if ( myobject == undefined ) {
	    }
	    // andernfalls das Feld ausfuellen
	    else {
		
		// Wert eintragen
		myobject.value = myOptionsStorage[mykey] + "\n";

		// Groesze anpassen an die Anzahl Zeilen, wenn es sich um eine Textarea handelt
		if ( myobject.type == "textarea" ) {
		    var myarray = myOptionsStorage[mykey].split("\n");
		    if ( myobject.readOnly == true )
			myobject.rows = myarray.length + 1;
		    else
			myobject.rows = myarray.length + 2;
		}

		// Hintergrundfarbe waehlen
		if (mykey.indexOf("Allow") > 0 ) {
		    myobject.style.background = "#f0fff0"
		}
		if (mykey.indexOf("Block") > 0 ) {
		    myobject.style.background = "#fff0f0"
		}
	    }
	}
	
    }

    //
    // Den Sicherheitsstatus anzeigen
    //
    myOptionsStorage_CheckConfigurationSecurity();
    
    
}

// Callback-Funktion, die die Farbe des Texteingabefeldes aendert, wenn dies angeklickt wurde
function myChangeFormColor(myevent)
{
    var target;


    if ( myevent["target"] !== undefined ) {
	target = myevent["target"];
    
	document.getElementById(target.id).style.color = "red"; 
    }
    
}

// Callback-Funktion eines Listener fuer eingehende Nachrichten
chrome.runtime.onMessage.addListener(handleMessage);
function handleMessage(request, sender, sendResponse) {
    // Falls eine Nachricht im erwarteten Format ist ...
    if ( request["msgtype"] != undefined ) {
	if ( request["msgtype"] == "spOptionsStart" ) {
	    sendResponse( {response: "OPTIONS_ALREADY_ACTIVE", tabid: myOwnTabId} );
	}
    }
}


// ================================================================================================================================
// **** START OF : $Id: function_storage.js,v 1.11 2018/01/20 11:15:33 user Exp $ **** 
//

// Die Funktion LoadOptions() lädt die Filter aus dem lokalen Storage
function LoadOptions() {

    
// ================================================================================================================================
// **** START OF : $Id: function_storage__LoadOptions.js,v 1.2 2017/08/24 09:55:39 user Exp $ **** 
//

// Implementierung fuer Chrome

// das get() laeuft asynchron!
// https://developer.chrome.com/extensions/storage
//
// Die Callback-Funktion LoadOptionsOnGot wird erst aufgerufen, wenn der ganze synchrone Ablauf erledigt ist,
// also erst nach dem Ende der Funktion LoadOptions()
//
chrome.storage.local.get(LoadOptionsOnGot);


//
// **** END OF   : $Id: function_storage__LoadOptions.js,v 1.2 2017/08/24 09:55:39 user Exp $ **** 
// ================================================================================================================================



}

// Callback-Funktion, die aufgerufen wird, wenn das Laden der Daten erfolgreich war
// Diese Callback wird auch dann aktiv, wenn keine Daten gefunden wurden und item damit ein leeres Objekt ist.
function LoadOptionsOnGot(item) {



    // Falls die gesuchten Werte im Storage vorhanden waren, diese auslesen
    if ( item["myOptionsSaved"] == undefined ) {
	
	// nichts zu tun, es liegen keine Werte vor

	//
	// Extrabehandlung fuer die Schriftgroesse bei Windows: hier ist small besser als der Standwert medium
	//
	if ( navigator.platform == "Win32" ) {
	    myOptionsStorage["myOptionFontSize"] = "small";
	}
	
    }
    else {

	let mytmp = item["myOptionsSaved"];
	

	// Der globale Variablen "myOptionsStorage" die Werte zuweisen

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
	for ( i=0;i<mykeys.length;i++ ) {
	    mykey = mykeys[i];
	    if ( mytmp[mykey] == undefined ) {
	    }
	    else {
		if (mykey != "myOptionChangeUserAgentStandardValues") 
		    myOptionsStorage[mykey] = mytmp[mykey];
	    }
	}
	
 
    }
    
    // Die neuen Werte anzeigen, sofern diese Funktion im Options-JS benutzt wird.
    // Das backgroundscript liest die Werte nur, ohne sie anzuzeigen
    if ( SPMODULENAME == "spFilterWebContentOptions" )
	ShowOptions();

    // Die Schriftgroesse der Anzeige aendern, wenn das Laden der neuen Werte in der WebConsole geschieht
    if ( (SPMODULENAME == "spFilterWebContentConsole") || (SPMODULENAME == "spFilterWebContentOptions") ){
	
	// Falls bereits eine CSS-Regel angelegt wurde, diese entfernen
	if ( myOwnCSSRuleIndex != -1 ) {
	    document.styleSheets[0].deleteRule(myOwnCSSRuleIndex);
	}
	
	// eine neue Regel an Index 0 anlegen
	myOwnCSSRuleIndex = document.styleSheets[0].insertRule("body {font-family: " + myOptionsStorage["myOptionFontFamily"]
							       + ";font-size: "+ myOptionsStorage["myOptionFontSize"] +  ";}", 0);
    }


    //
    // Die Konfiguration auf Sicherheit pruefen
    //
    myOptionsStorage_CheckConfigurationSecurity();
    
    
}


function LoadOptionsOnError(error) {
}


//
// Die folgende Funktion registriert einen Listener fuer Storage-Aenderungen

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/onChanged
function listenToStorageChanges(){
    chrome.storage.onChanged.addListener(detectStorageChange);
}

function detectStorageChange(change, area){
    //Ignore the change information. Just re-get all options
    LoadOptions();
}


function stopListeningToStorageChanges(){
    chrome.storage.onChanged.removeListener(detectStorageChange);
}


//
// **** END OF   : $Id: function_storage.js,v 1.11 2018/01/20 11:15:33 user Exp $ **** 
// ================================================================================================================================


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



//
// **** END OF   : $Id: function_utils.js,v 1.6 2018/01/20 11:15:33 user Exp $ **** 
// ================================================================================================================================



var i;
var j;


//
// Bei Aufruf der Optionen geschieht folgendes


//
// (A) Mitteilung senden, dass die Optionen aufgerufen wurden
//     Falls die Nachricht beantwortet wird, ist bereits eine andere Optionen-Seite aktiv
//     Dies dem Anwender mitteilen und die hier aktive Seite abschalten
//
{
    // ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.options.js__SendMessage.js,v 1.1 2017/09/03 08:43:47 user Exp $ **** 
//

// Implementierung fuer chrome
// https://developer.chrome.com/extensions/runtime#method-sendMessage
chrome.runtime.sendMessage( {msgtype : "spOptionsStart"}, handleResponse );

//
// **** END OF   : $Id: spFilterWebContent.options.js__SendMessage.js,v 1.1 2017/09/03 08:43:47 user Exp $ **** 
// ================================================================================================================================
;
    function handleResponse(message) {


	// Falls tatsaechlich eine Antwort vorliegt
	if ( (message != undefined) && (message["response"] == "OPTIONS_ALREADY_ACTIVE") ) {

	    //
	    // Den Inhalt der Optionsseite entfernen
	    //
	    // TODO: schoen waere es, den Tab mit der Optionsseite zu aktivieren.
	    // Die Tab-ID steht in der Antwort message["tabid"]
	    //
	    var i;
	    for ( i = document.body.childNodes.length - 1; i >=0 ; i--)  
		document.body.removeChild( document.body.childNodes[i] );
	    
	    var mydiv = document.createElement('DIV');
	    mydiv.className = "spMessageOptionsAlreadyActive";
	    mydiv.appendChild(document.createTextNode(sp_CurrentDate2String() + " : ERROR : Another options page is already active with TabID " + message["tabid"] + "."));
	    document.body.appendChild(mydiv);

	    document.title = "spOptionsError";

	    chrome.runtime.onMessage.removeListener(handleMessage);

	    //
	    // Firefox 55 kennt chrome.tabs.highlight() nicht, obwohl dies laut Doku der Fall sein soll
	    //    Error: An unexpected error occurred
	    //
	    //console.log("START OF chrome.tabs.highlight({tabs : " + message["tabid"] + "});");
	    //chrome.tabs.highlight({tabs : message["tabid"]});
	    //console.log("END OF chrome.tabs.highlight({tabs : " + message["tabid"] + "});");
	}
    }
    function handleError(error) {
    }
    
}

//  (B) die save-Buttons werden mit einem Event-Handler ausgestattet
var mybuttons =  document.getElementsByClassName("mySaveButton");
for (i = 0; i < mybuttons.length; i++) {
  mybuttons[i].addEventListener("click",SaveOptions);
}

// (C)  Die Texteingabefelder werden mit einem Event-Handler ausgestattet
var myenterclasses=[ "enter_allow", "enter_block", "enter_redirect", "enter_general" ];
for ( i = 0; i < myenterclasses.length; i++ ) {
    var mykeys = document.getElementsByClassName(myenterclasses[i]);
    for (j = 0; j < mykeys.length; j++) {
	mykeys[j].addEventListener("click", myChangeFormColor);
    }
}


// (D) die gespeicherten Filter werden eingelesen und angezeigt
LoadOptions();

// (E) Die allgemeinen Informationen werden angezeigt
{
    var myp = document.getElementById("spGeneralInformation");

    //
    // TODO: Die Sinnhaftigkeit der folgenden Werte erschliesst sich nicht
    //
    // content of object < chrome.runtime.PlatformOs > follows :
    // Object { MAC: "mac", WIN: "win", ANDROID: "android", CROS: "cros", LINUX: "linux", OPENBSD: "openbsd" }
    //
    // content of object < chrome.runtime.PlatformArch > follows :
    // Object { ARM: "arm", X86-32: "x86-32", X86-64: "x86-64" }
    //

    myp.appendChild(document.createTextNode("Browser App Name = " + navigator.appName));
    myp.appendChild(document.createElement("BR"));
    myp.appendChild(document.createTextNode("Browser App Code Name = " + navigator.appCodeName));
    myp.appendChild(document.createElement("BR"));
    myp.appendChild(document.createTextNode("Browser App Version = " + navigator.appVersion));
    myp.appendChild(document.createElement("BR"));
    myp.appendChild(document.createTextNode("Browser Platform = " + navigator.platform));
    myp.appendChild(document.createElement("BR"));
    myp.appendChild(document.createTextNode("Browser User Agent = " + navigator.userAgent));
    myp.appendChild(document.createElement("BR"));
    myp.appendChild(document.createTextNode("Browser Product = " + navigator.product));
    myp.appendChild(document.createElement("BR"));
    myp.appendChild(document.createTextNode("Browser Language = " + navigator.language));
}

// (F)
// Die Ueberschrift wird gesetzt
//
document.title = "spOptions";


// (G)
// Die unpassenden Brower-spezifischen Bestandteile werden geloescht
//
// An ID should be unique within a page.
// However, if more than one element with the specified ID exists,
// the getElementById() method returns the first element in the source code.

// Firefox-Bestandteile in fremden Browsern loeschen
if ( navigator.userAgent.indexOf("Firefox") < 0 ) {
    var myobj = undefined;
    
    myobj = document.getElementById("Special_Notes_for_Firefox");
    while ( myobj != undefined ) {
	myobj.parentNode.removeChild(myobj);
	myobj = document.getElementById("Special_Notes_for_Firefox");
    }
}

// Chrome-Bestandteile in fremden Browsern loeschen
if ( navigator.userAgent.indexOf("Chrome") < 0 ) {
    var myobj = undefined;
    
    myobj = document.getElementById("Special_Notes_for_Chrome");
    while ( myobj != undefined ) {
	myobj.parentNode.removeChild(myobj);
	myobj = document.getElementById("Special_Notes_for_Chrome");
    }
}

//
// Die Export- und Import-Buttons belegen
//

var myExportButton = document.getElementById("export-button01");
myExportButton.addEventListener("click",spDownloadLocalStorage);

function spDownloadLocalStorage() {
    chrome.storage.local.get(null, function(items) { // null implies all items
	// Convert object to a string.
	var result = JSON.stringify(items,null,1);

// ================================================================================================================================
// **** START OF : $Id: spFilterWebContent.options.js__DownloadSettings.js,v 1.1 2022/07/30 06:26:03 user Exp $ **** 
//

// Implementierung fuer Chrome

// Save as file
	// es gibt auch: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	//
	var url = 'data:application/json;base64,' + btoa(result);
	// firefox bricht hier ab. eine http-URL hingegen funktioniert
	var mydownload = chrome.downloads.download({
            url: url,
            filename: 'spBlockWebDiagnosisTelemetry.saved-options.json',
	    saveAs : true
	}, function (arg) { console.log('download ID follows'); console.log(arg); } );


//
// **** END OF   : $Id: spFilterWebContent.options.js__DownloadSettings.js,v 1.1 2022/07/30 06:26:03 user Exp $ **** 
// ================================================================================================================================

	
    });
}

var myImportFilename = document.getElementById("import-button01");
myImportFilename.addEventListener('change', function (evt) {
    console.log('import-button01 Event Handler START');
    var f = evt.target.files[0];
    if(f) {
	var reader = new FileReader();
	reader.readAsText(f);
	reader.onload = function(e) {
	    document.getElementById
	    var myspan = document.getElementById("import-result");
	    myspan.textContent = " ";
	    
	    var mybold1 = document.createElement('strong');
	    var mytextnode1 = document.createTextNode(" | filename : "); 
	    mybold1.appendChild(mytextnode1); 
	    myspan.appendChild(mybold1);
	    myspan.appendChild(document.createTextNode(f.name));
	    var mybold2 = document.createElement('strong');
	    var mytextnode2 = document.createTextNode(" | result : "); 
	    mybold2.appendChild(mytextnode2); 
	    myspan.appendChild(mybold2);
	    
	    
	    var contents = e.target.result;
	    try {
		var mynewoptionsContainer = JSON.parse(contents);
		var mynewoptions = mynewoptionsContainer["myOptionsSaved"];
		myOptionsStorage = mynewoptions
		chrome.storage.local.set({myOptionsSaved : mynewoptions}, ShowOptions);
		myspan.appendChild(document.createTextNode("success"));
	    } catch(e) {
		myspan.appendChild(document.createTextNode("error"));
		myspan.appendChild(document.createTextNode(" --- " + e.message));
	    }
	}
    }
});













//
// **** END OF   : $Id: spFilterWebContent.options.js,v 1.21 2022/08/06 19:37:56 user Exp $ **** 
// ================================================================================================================================
