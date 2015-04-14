import Matcher from './matcher';

class Updater {
  constructor(inputEl, resultsEl) {
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
    this.matcherMap = {};

    // this.lastQuery = null;

    var self = this;
    chrome.bookmarks.getTree((items) => {
      this.matcherMap[''] = items[0].children;
      self.bookmarks = this.matcherMap[''];
      self.render();
    });
  }

  getChildren(id) {
    let key = `id-${id}`;

    if ( this.matcherMap[key] ) {
      this.bookmarks = this.matcherMap[key];
      this.render();
    } else {
      let self = this;
      chrome.bookmarks.getChildren(id, (items) => {
        self.matcherMap[key] = items;
        self.bookmarks = items;
        self.render();
      });
    }
  }

  search(q) {
    let self = this;

    console.log(`search: ${q}`);

    // if ( this.lastQuery == q ) return;
    // this.lastQuery = q;

    if ( this.inputEl.value.length == 0 ) {
      // we just cleared the query so reset usign the baseResults (go
      // into browse mode)
      this.bookmarks = this.matcherMap[''];
      self.render();

    } else if ( this.matcherMap[q] ) {
      self.bookmarks = this.matcherMap[q];
      self.render();

    } else if ( this.bookmarks == this.matcherMap[''] ) {
      let self = this;
      chrome.bookmarks.search(q, function (items) {
        self.matcherMap[q] = items;
        self.bookmarks = items;
        self.render();
      });

    } else {
      let filtered = this.bookmarks.filter(function(obj) {
        // Only include (actionable) bookmarks (with a url)
        if ( !obj.url ) return false;

        if ( !obj.matcher ) {
          obj.matcher = new Matcher({title: obj.title, url: obj.url});
        }
        return obj.matcher.matches(q);
      });

      self.matcherMap[q] = filtered;
      this.bookmarks = filtered;
      self.render();
    }
  }

  render() {
    let filtered = this.filterForRender();
    let content = Findr.templates.results({bookmarks: filtered});
    this.resultsEl.innerHTML = content;
  }

  filterForRender() {
    return this.bookmarks.filter((obj) => {
      // let hasChildren = obj['children'] && obj.children.length > 0;
      // debugger
      return !!(obj.id || obj.url);
    });
  }
}

module.exports = Updater ;
