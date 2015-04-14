this["Bookmarkr"] = this["Bookmarkr"] || {};
this["Bookmarkr"]["templates"] = this["Bookmarkr"]["templates"] || {};
this["Bookmarkr"]["templates"]["results"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <li class=\"box-bordered-right\">\n      "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + " / "
    + alias3(((helper = (helper = helpers.child_count || (depth0 != null ? depth0.child_count : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"child_count","hash":{},"data":data}) : helper)))
    + "\n      <br />\n      "
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\n    </li>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "    <li class=\"box\">\n      "
    + ((stack1 = (helpers.highlight || (depth0 && depth0.highlight) || alias1).call(depth0,"title",{"name":"highlight","hash":{},"data":data})) != null ? stack1 : "")
    + "\n      <br />\n      "
    + ((stack1 = (helpers.highlight || (depth0 && depth0.highlight) || alias1).call(depth0,"url",{"name":"highlight","hash":{},"data":data})) != null ? stack1 : "")
    + "\n    </li>\n";
},"6":function(depth0,helpers,partials,data) {
    return "  No results found.\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.bookmarks : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});