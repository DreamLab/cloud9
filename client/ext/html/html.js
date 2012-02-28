/**
 * HTML Editor for the Cloud9 IDE
 *
 * @copyright 2010, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

define(function(require, exports, module) {

var ide = require("core/ide");
var ext = require("core/ext");
var code = require("ext/code/code");
var markup = require("text!ext/html/html.xml");

var mimeTypes = [
    "text/html",
    "application/xhtml+xml",
    "text/javascript",
    "text/plain",
    "application/xml"
];

module.exports = ext.register("ext/html/html", {
    name    : "HTML Editor",
    dev     : "Ajax.org",
    type    : ext.GENERAL,
    alone   : true,
    deps    : [code],
    markup  : markup,
    nodes   : [],
    enabled : false,
    inited  : false,

    hook: function() {
        var _self = this;
        ide.addEventListener("socketMessage", this.onMessage.bind(this));
    },

    init : function() {
        //Append the button bar to the main toolbar
        var nodes = barHtmlMode.childNodes;
        var node;
        for (var i = nodes.length - 1; i >= 0; i--) {
            node = ide.barTools.appendChild(nodes[0]);
            if (node.nodeType != 1)
                continue;
            this.nodes.push(node);
        }

        btnHtmlOpen.onclick = this.onOpenPage.bind(this);
        this.inited = true;
        this.enabled = true;
    },

    onOpenPage : function() {
        ide.send({
            "command": "gethost",
            "runner": "node"
        });
    },

    onMessage: function(e) {
        var message = e.message;

        console.log("PREVIEW", message);
        switch(message.type) {
            case "preview-link":
                window.open(location.protocol + "//" + message.data, "_blank");
            break;
            case "state":
                if (message.nodeProcessRunning) {
                    ext.initExtension(this);
                }
            break;
            case "node-start":
                if (!this.inited) {
                    ext.initExtension(this);
                }
                if (!this.enabled) {
                    this.enable();
                }
            break;
            case "node-exit":
                if (this.enabled) {
                    this.disable();
                }
            break;
        }
    },

    enable : function() {
        if (this.enabled)
            return;
        this.enabled = true;

        this.nodes.each(function(item){
            item.show();
        });
    },

    disable : function(){
        if (!this.enabled)
            return;
        this.enabled = false;

        this.nodes.each(function(item){
            item.hide && item.hide();
        });
    },

    destroy : function(){
        this.nodes.each(function(item){
            item.destroy && item.destroy(true, true);
        });
        this.nodes = [];
    }
});

});
