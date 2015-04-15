class Matcher {
  constructor (string) {
    this.string = (string || '').toLowerCase();
    this.previousMatches = {};
  }

  matches(query) {
    if ( this.hasMatchData(query) ) return this.matchData(query);

    let match = false;
    let locations = [];
    let q = query.toLowerCase();
    let qlen = q.length;
    let j = 0;
    for ( let i = 0; i < this.string.length && !match; i++) {
      if ( this.charAt(i) == q[j] ) {
        locations.push(i);
        j++;
      }
      match = ( j == qlen );
    }

    if ( match) this.setMatchData(query, match, locations);

    return match;
  }

  setMatchData(query, bool, locations) {
    this.previousMatches[query] = {
      match: bool,
      locations: locations
    };
  }

  hasMatchData(query) {
    return !!this.matchData(query);
  }

  matchData(query) {
    return this.previousMatches[query];
  }

  charAt(i) {
    return this.string.charAt(i);
  }
}

module.exports = Matcher;
