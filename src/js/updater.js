class Updater {
  constructor(treemap, inputEl, resultsEl) {
     this.treemap = treemap;
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
  }

  filter(query) {
    let {modq, exclusions} = this.exclusions(query);

    console.log('exclusions', modq, exclusions);

    this.bookmarks = this.treemap.filter(modq, exclusions);
    this.render(query);
    this.resize();
  }

  exclusions(query) {
    let modq = query;
    let defaults = {
      history: false,
      bookmark: false
    };

    // The following regex SHOULD capture just the flag. See:
    //   https://regex101.com/r/mG2tH0/3
    let capture = this.inputEl.value.match(/^(h|b):(.*)|(.*)(?:\s)-(h|b)$/);

    if ( capture ) {
      if ( capture[1] ) { // inclusion notation (b:foo)
        let flag = capture[1];
        modq = capture[2];
        let flag_name = {
          h: 'history',
          b: 'bookmark'
        }[flag];

        if ( flag_name && defaults[flag_name] != undefined ) {
          defaults = {
            history: true,
            bookmark: true
          };
          defaults[flag_name] = false;
        }

      } else if ( capture[4] ) { // exclusion notation (foo -b)
        modq = capture[3];
        let flag = capture[4];
        let flag_name = {
          h: 'history',
          b: 'bookmark'
        }[flag];

        if ( flag_name && defaults[flag_name] != undefined ) {
          defaults[flag_name] = true;
        }
      }
    }

    return {
      modq: modq,
      exclusions: defaults
    };
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
