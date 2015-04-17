this["Findr"] = this["Findr"] || {};
this["Findr"]["templates"] = this["Findr"]["templates"] || {};
this["Findr"]["templates"]["results"] = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "  <div class=\""
    + ((stack1 = helpers['if'].call(depth0,(data && data.first),{"name":"if","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "result box\">\n    "
    + ((stack1 = ((helper = (helper = helpers.sourceTag || (depth0 != null ? depth0.sourceTag : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"sourceTag","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    <div class=\"path\">"
    + ((stack1 = (helpers.highlight || (depth0 && depth0.highlight) || alias1).call(depth0,"path",(depths[1] != null ? depths[1].query : depths[1]),{"name":"highlight","hash":{},"data":data})) != null ? stack1 : "")
    + "</div>\n    <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" target=\"new\">"
    + ((stack1 = (helpers.highlight || (depth0 && depth0.highlight) || alias1).call(depth0,"url",(depths[1] != null ? depths[1].query : depths[1]),{"name":"highlight","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n  </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "selected ";
},"4":function(depth0,helpers,partials,data) {
    return "  No results found.\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.bookmarks : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});