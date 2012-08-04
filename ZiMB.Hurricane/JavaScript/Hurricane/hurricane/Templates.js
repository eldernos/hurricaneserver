goog.provide('Hurricane.Templates')
goog.require('Hurricane.Base')
goog.require('goog.ui.registry');
goog.require('goog.dom.query');
goog.require('goog.ui.Button');
goog.require('goog.ui.LabelPassword');
goog.require('goog.ui.RoundedPanel');
goog.require('goog.ui.PopupColorPicker');
//  Soy Template Renderer Class

var Soy = HBase.extend({
    _className: "Soy",
    templateFunc: null,
    context: null,
    ctor: function (fn, context) {
        this.templateFunc = fn;
        this.context = context;
    },
    Render: function (domTarget) {
        var html = this.templateFunc(this.context);

        /*
        var panel = goog.ui.RoundedPanel.create(0, 0, '#000000', '#000000', 0);
        panel.decorate(domTarget);

        panel.getContentElement().innerHTML = html;
        */
        //var iframe = goog.dom.createDom('iframe', {frameborder: '0', style: "width:100%; height:100%;", src: "data:text/html;charset=utf-8," + escape(html) });
        var div = goog.dom.createDom('div', { id: 'templatediv' });
        div.innerHTML = html;
        goog.dom.appendChild(domTarget, div);

        this.ApplyClosure(div);


    },
    ApplyClosure: function (domTarget) {
        var closureItems = $(domTarget).find('[data-goog]');
        closureItems.each(function (index, item) {
            var c = $(item).attr('data-goog');
            var v = $(item).attr('data-ctor');
            var ci = eval(c);
            var obj = new ci(v);
            obj.render();
            $(item).replaceWith(obj.getElement());            
            obj.getContentElement().id = item.id;

        });

        var scripts = $(domTarget).find('script');
        scripts.each(function (index, item) {
            $('head').append(item);
        });

    }
});