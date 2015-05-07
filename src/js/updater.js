class Updater {
  constructor(treemap, inputEl, resultsEl) {
    this.treemap = treemap;
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
  }

  filter(query) {
    this.bookmarks = this.treemap.filter(query);
    this.render(query);
    this.resize();
  }

  render(query) {
    let content = Findr.templates.results({
      query: query,
      bookmarks: this.bookmarks
    });
    this.resultsEl.innerHTML = content;
  }

  // TODO: This really is just thrown in here and likely does not belong
  // in this class. Clean it up!
  resize() {
    let docHeight = document.documentElement.offsetHeight;
    let contentHeight = document.querySelector('#main').offsetHeight;
    if ( contentHeight < docHeight ) {
      var h = `${contentHeight}px`;
      document.body.style.height = h;
      document.getElementsByTagName("html")[0].style.height = h;
    }
  }
}

module.exports = Updater;
