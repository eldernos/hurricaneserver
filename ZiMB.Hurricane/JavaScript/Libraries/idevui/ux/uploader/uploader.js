// JavaScript Document
/*

    iDev UI Framework  copyright (c) 2012 Trakware Solutions Limited.

    Do not remove this copyright message

    Description: uploader widget 
    version    : 1.0.0
    build      : 120626.1

    Started    : 5th March 2011

    Notes:
    
    Distributed as part of iDevUI.

    iDevUI is distributed under the terms of the MIT license for non-commercial
    For more information visit http://www.idevui.com/

    Makes use of jquery

    History:
        1.0.0   2011-11-23  First release


    120626.1
    - Add image to button properties
    - Fixed bug where url needed to be set dynamically on load method


*/

///////////////////////////////////////////////////////////////////////////////

idev.ux.widgetUploader = baseWidget.extend(
{
    init: function(config)
    {
        this._super( config );
        this.wtype = "uploader";
        this.url = config.url || "";  
        this.params = config.params || {};
        this.color = config.color;
        this.startColor = config.startColor;
        this.endColor = config.endColor;
        this.borderColor = config.borderColor;
        this.border = config.border;
        this.radius = config.radius;
        this.fontSize = config.fontSize;
        this.fontColor = config.fontColor;
        this.image = config.image;
        this.text = config.text || "Upload";
        this.tpl = new idev.wTemplate(
            "<div id='{id}' class='ui-element' style='{elementstyle}{style};'>",
            "<form id='{id}-form' name='{id}-form' action='{url}' method='post' enctype='multipart/form-data'>",
            "<input id='{id}-data' type='hidden'/>",
            "<div id='{id}-params'></div>",
            "<input name='file' id='{id}-input' type='file' style='left:0px;top:0px;width:" + this.width +"px;height:" + this.height +"px;-moz-opacity:0;filter:alpha(opacity: 0);opacity: 0;z-index: 2;position:relative;cursor:pointer'/>",
            "<div id='{id}-button' style='position: absolute;top: 0px;left: 0px;z-index: 1;'></div>",
            "<iframe id='{id}-upload_target' name='{id}-upload_target' src='' style='width:0;height:0;border:0px solid #fff;visibility:hidden;'></iframe>",
            "</form>", 
            "</div>" );
        idev.internal.add(this);
    },                                 
    render : function()
    {
        if (this.renderTo == null) return;
        if (this.url == "") return;

        var data = new Array();
        
        data['id'] = this.id;
        data['width'] = this.width;
        data['height'] = this.height;
        data['elementstyle'] = this.elementStyle;
        data['style'] = this.style;
        data['url'] = this.url;
        
        var  sHTML = this.tpl.render(data);
        
        $("#" + this.renderTo).append(sHTML);
        if (this.events.afterRender) this.events.afterRender(this);
        this.btn = new idev.ui.widgetButton({
            parent:this,
            renderTo:this.id + "-button", 
            width:this.width,
            height:this.height,
            color:this.color,
            startColor:this.startColor,
            endColor:this.endColor,
            borderColor:this.borderColor,
            border:this.border,
            radius:this.radius,
            fontSize:this.fontSize,
            fontColor:this.fontColor,
            image:this.image,
            text:this.text
        });
        this.btn.render();
        $( '#' +  this.id + "-input" ).change(function(e)
        {
            if (e == null) e = window.event;
            var wgt = idev.get(this.id.replace("-input",""));
            if (wgt.events.change) wgt.events.change(wgt,e);
        });
        this.rendered = true;
    },
    getValue : function()
    {
        return  $( '#' +  this.id + "-input" ).val();
    },
    setParam : function(key,value)
    {
        this.params[key] = value;
    },
    clearParams : function()
    {
        this.params = {};
    },
    upload : function(callback)
    {
        if ($('#' + this.id + "-input").val() == "") return; 
        this.callback = callback;
        var sHTML = "";        
        for (key in this.params)
        {
            sHTML += "<input name='"+key+"' value='"+this.params[key]+"' type='hidden'/>";          
        }
        $('#' + this.id + "-params" ).html(sHTML);        
        var formid = this.id;
        $('#' + formid + "-form").attr("action",this.url);
        $('#' + formid + "-form").submit(function() {
            document.getElementById(formid + "-form").target = formid + "-upload_target";
            $("#" + formid + "-upload_target").load(function(){
                var ret = frames[formid + '-upload_target'].document.getElementsByTagName("body")[0].innerHTML;
                var data = eval("("+ret+")");
                callback(data);
            });
        });
        $('#' + this.id + "-form").submit();
    },
    getFilename : function()
    {
        var objRE = new RegExp(/([^\/\\]+)$/);    
        
        var strName = objRE.exec($( '#' +  this.id + "-input" ).val());     
        if (strName == null) 
        {        
            return "";    
        } 
        return strName[0]; 
    }
});
idev.register("uploader",idev.ux.widgetUploader);