import Matcher from './matcher';

class Updater {
  constructor(inputEl, resultsEl) {
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
    this.matcherMap = {};

    var self = this;
    chrome.bookmarks.getTree((items) => {
      this.matcherMap[''] = items[0].children;
      self.bookmarks = this.matcherMap[''];
      self.render();
    });
  }

  search(q) {
    var self = this;

    if ( this.inputEl.value.length == 0 ) {
      // we just cleared the query so reset usign the baseResults (go
      // into browse mode)
      this.bookmarks = this.matcherMap[''];
      self.render();

    } else if ( this.matcherMap[q] ) {
      self.bookmarks = this.matcherMap[q];
      self.render();

    } else if ( this.bookmarks == this.matcherMap[''] ) {
      console.log('Perform initial search: '+ q);
      let self = this;
      chrome.bookmarks.search(q, function (items) {
        self.matcherMap[q] = items;
        self.bookmarks = items;
        self.render();
      });

    } else {
      console.log('filter these results', this.bookmarks);
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
    // debugger
    let content = Bookmarkr.templates.results({bookmarks: this.bookmarks});
    this.resultsEl.innerHTML = content;
  }
}

module.exports = Updater ;
