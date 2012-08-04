/*
    This is where I store my extended controls for Closure.  







*/


//////   Extended version of goog.ui.LabelInput that utilizes a password input instead of a standard text input.

goog.provide('goog.ui.LabelPassword');
goog.require('goog.ui.LabelInput');

goog.ui.LabelPassword = function (opt_label, opt_domHelper) {
    goog.ui.LabelInput.call(this, opt_label, opt_domHelper);
}
goog.inherits(goog.ui.LabelPassword, goog.ui.LabelInput);

goog.ui.LabelPassword.prototype.createDom = function () {
    this.setElementInternal(this.getDomHelper().createDom('input', { 'type': 'password' }));
}