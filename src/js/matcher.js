class Matcher {
  constructor (strings={}) {
    this.strings = strings;
  }

  matches(query) {
    query = query.toLowerCase();
    let qlen = query.length;

    // Match on any string
    let match = false;

    Object.keys(this.strings).some((type) => {
      let str = this.strings[type].toLowerCase();
      let j = 0;
      let len = str.length;

      // a previous string matched, so exit
      if ( match ) return true;

      let matchLocations = [];
      for ( let i = 0; i < len && !match; i++) {
        if ( str.charAt(i) == query[j] ) {
          matchLocations.push(i);
          j++;
        }
        match = ( j == qlen );
      }

      if ( match ) {
        this.details = {};
        this.details[type] = matchLocations;
      }

      // when true will break out of some() loop
      return match;
    });

    return match;
  }
}

module.exports = Matcher;
