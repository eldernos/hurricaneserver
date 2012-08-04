// My extremely ambitious attempt at a JSON -> Closure templating system.

goog.provide('Hurricane.JsonT');
goog.require('goog.ui.registry');
goog.require('goog.dom.query');
goog.require('goog.ui.Button');
goog.require('goog.ui.LabelPassword');
goog.require('goog.ui.RoundedPanel');
var JsonT = HBase.extend({
    _className: "JsonT",
    context: null,
    template: null,
    panel: null,
    ctor: function (context) {
        if (!Handlebars) {
            $H.Include('/js/Hurricane/lib/handlebars.js');

            Handlebars.registerHelper('control', function (controlDefinition) {
                 
            });
            

        }
        this.context = context;
    },
    PreRender: function() {

    },
    Render: function (targetDom) {
        this.panel = goog.ui.RoundedPanel.create(0, 0, '#000000', '#000000', 0);
        panel.decorate(targetDom);
        var targetSize = goog.style.getSize(targetDom);
        goog.style.setSize(panel.getContentElement(), targetSize.width, targetSize, height);

        var html = "";

        $.ajax({
            url: this.context.PAGE.template,
            dataType: "text",
            async: false,
            success: function (value) {
                html = value;
            },
            error: function () {
               
            }
        });

        this.template = Handlebars.compile(html);
        var results = this.template(this.context);


        
        /*
        var panel = goog.ui.RoundedPanel.create(0, 0, '#000000', '#000000', 0);
        panel.decorate(targetDom);
        var targetSize = goog.style.getSize(targetDom);
        goog.style.setSize(panel.getContentElement(), targetSize.width, targetSize.height);

        this.template.CONTROLS.forEach(function (item, index, array) {
            var c = new item.control(item.ctor);
            c.setId(item.id);
            panel.addChild(c, true);
        });

        
        this.template.EVENTS.forEach(function (item, index, array) {
            var handler = function () { item.handler.apply(panel, arguments); };
            goog.events.listen(panel.getChild(item.target), item.type, handler);
        
        });
        
        return panel;
        */
    }


});


/*
    Template Structure

    OBJECT WITH PROPERTIES ->

        PAGE:
            -Form: bool
            -Dock: based on parent container.
            -Requires: google closure items required.
        SCRIPTS:

        STYLES:
        CONTROLS:
        EVENTS:




*/