this["Findr"] = this["Findr"] || {};
this["Findr"]["templates"] = this["Findr"]["templates"] || {};
this["Findr"]["templates"]["results"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <li class=\"box"
    + ((stack1 = helpers['if'].call(depth0,(data && data.first),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" data-id="
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + ">\n      "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + " ("
    + alias3(((helper = (helper = helpers.child_count || (depth0 != null ? depth0.child_count : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"child_count","hash":{},"data":data}) : helper)))
    + ") / "
    + alias3(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"parentId","hash":{},"data":data}) : helper)))
    + "\n      <br />\n      "
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\n    </li>\n";
},"3":function(depth0,helpers,partials,data) {
    return " selected";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <li class=\"box"
    + ((stack1 = helpers['if'].call(depth0,(data && data.first),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" data-id="
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + " data-url=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">\n      "
    + ((stack1 = (helpers.highlight || (depth0 && depth0.highlight) || alias1).call(depth0,"title",{"name":"highlight","hash":{},"data":data})) != null ? stack1 : "")
    + " ("
    + alias3(((helper = (helper = helpers.first || (data && data.first)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"first","hash":{},"data":data}) : helper)))
    + ")\n      <br />\n      "
    + ((stack1 = (helpers.highlight || (depth0 && depth0.highlight) || alias1).call(depth0,"url",{"name":"highlight","hash":{},"data":data})) != null ? stack1 : "")
    + "\n    </li>\n";
},"7":function(depth0,helpers,partials,data) {
    return "  No results found.\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.bookmarks : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});