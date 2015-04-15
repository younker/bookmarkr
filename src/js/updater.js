import Matcher from './matcher';

class Updater {
  constructor(treemap, inputEl, resultsEl) {
    this.treemap = treemap;
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
  }

  filter(query) {
    this.bookmarks = this.treemap.filter(query);
    this.render(query);
  }

  render(query) {
    let content = Findr.templates.results({
      query: query,
      bookmarks: this.bookmarks
    });
    this.resultsEl.innerHTML = content;
  }
}

module.exports = Updater;
