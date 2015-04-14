class Matcher {
  constructor (...strings) {
    this.details = {};
    this.strings = strings.map((str) => { return str.toLowerCase() });
  }

  matches(query) {
    query = query.toLowerCase();
    let qlen = query.length;

    // Match on any string
    let match = false;

    // location that each match occurred
    this.details[query] = {};

    this.strings.some((str) => {
      let j = 0;
      let len = str.length;

      // a previous string matched, so exit
      if ( match ) return true;

      this.details[query] = {
        string: str,
        indices: []
      };

      for ( let i = 0; i < len && !match; i++) {
        if ( str.charAt(i) == query[j] ) {
          this.details[query].indices.push(i);
          j++;
        }
        match = ( j == qlen );
      }

      // when true will break out of some() loop
      return match;
    });

    console.log(`Match Found? ${match}`, this.details[query]);
    return match;
  }
}

module.exports = Matcher;
