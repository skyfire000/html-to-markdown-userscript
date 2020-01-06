// ==UserScript==
// @name            HTML to Markdown
// @description     Convert selected HTML to markdown.
// @version         1.1
// @author          Wayne Hartmann
// @license         GPL
// @include         *
// @grant           GM_setClipboard
// @require         https://raw.githubusercontent.com/wayne-hartmann/html-to-markdown-userscript/master/htmldomparser.js
// @require         https://raw.githubusercontent.com/wayne-hartmann/html-to-markdown-userscript/master/html2markdown.js
// ==/UserScript==

if (!("contextMenu" in document.documentElement &&
      "HTMLMenuItemElement" in window)) return;

var body = document.body;
body.addEventListener("contextmenu", initMenu, false);

var menu = body.appendChild(document.createElement("menu"));
menu.outerHTML = '<menu id="userscript-html-to-markdown" type="context">\
                    <menuitem label="Copy HTML to BBcode"></menuitem>\
                  </menu>';

document.querySelector("#userscript-html-to-markdown menuitem")
        .addEventListener("click", convertHTML, false);

function initMenu(aEvent) {
  // Executed when user right click on web page body
  var node = aEvent.target;
  var item = document.querySelector("#userscript-html-to-markdown menuitem");
  body.setAttribute("contextmenu", "userscript-html-to-markdown");
}

function addParamsToForm(aForm, aKey, aValue) {
  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", aKey);
  hiddenField.setAttribute("value", aValue);
  aForm.appendChild(hiddenField);
}

function convertHTML(aEvent) {
  var range = window.getSelection().getRangeAt(0);
  fragment = range.cloneContents();
  span = document.createElement('SPAN');
  span.appendChild(fragment);
  content = span.innerHTML;
  var md = HtmltoBB(content);
  GM_setClipboard(md, 'text');
}

function HtmltoBB(html) {

	html = html.replace(/<br\s*[\/]?>/gi, "\n");
	html = html.replace(/<b>/gi, "[b]");
	html = html.replace(/<i>/gi, "[i]");
	html = html.replace(/<u>/gi, "[u]");
	html = html.replace(/<\/b>/gi, "[/b]");
	html = html.replace(/<\/i>/gi, "[/i]");
	html = html.replace(/<\/u>/gi, "[/u]");
	html = html.replace(/<em>/gi, "[b]");
	html = html.replace(/<\/em>/gi, "[/b]");
	html = html.replace(/<strong>/gi, "[b]");
	html = html.replace(/<\/strong>/gi, "[/b]");
    html = html.replace(/<strike>/gi, "[s]");
	html = html.replace(/<\/strike>/gi, "[/s]");
    html = html.replace(/<sub>/gi, "[sub]");
	html = html.replace(/<\/sub>/gi, "[/sub]");
    html = html.replace(/<sup>/gi, "[sup]");
	html = html.replace(/<\/sup>/gi, "[/sup]");
    html = html.replace(/<hr>/gi, "-----");
    //html = html.replace(/<div(.*?)style="text-align:(.*?)"(.*?)>([\s\S]*?)<\/div>?=*$/gmi, "[$2]$4[/$2]");
	html = html.replace(/<div(.*?)style="(.*?)"(.*?)>/gi, "[center]");
	html = html.replace(/<\/div>/gi, "[/center]");

	html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]");
	html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");

	html = html.replace(/\/\//gi, "/");	

	html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "");
	html = html.replace(/\r\r/gi, ""); 
	html = html.replace(/\[img]\//gi, "[img]");
	html = html.replace(/\[url=\//gi, "[url=");

	html = html.replace(/(\S)\n/gi, "$1 ");
  html = html.replace(/\n\n/gi, "\n");

	return html;
}
