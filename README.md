# Findr

Fuzzy finder for chrome bookmarks.

# How To Find

Once installed, hit `ctrl+b` (or `cmd+b`) and start typing.

# Results Navigation

- `cnrl+p`: Scorll up
- `cnrl+n`: Scroll down
- `return`: Open bookmark in a new tab

# Development

- Clone locally
- Open up `chrome://extensions/`
- Hit the `Load Unpacked Extension` button and browse to the `findr` directory (make sure it is the [/findr](https://github.com/younker/findr/tree/master/findr) directory inside the repo)

It's now loaded and you can use it however you like. For focused `popup.html` development, grab the `ID` from the `Findr` entry on the `chrome://extensions` page and go to `chrome-extension://__EXTENSION_ID__/popup.html`.

# TODO
- [ ] Clean up and move exclusion logic (in updater.exclusions) to it's own class
- [ ] Update README with in/exclusion instruction/examples
- [ ] Do not refresh results when the last char is ' ' or ' -' (related to adding exclusion operators)
- [ ] Vertically center selected option for long lists
- [ ] Remove history/bookmark dups
- [ ] ES6ify / Polish code
- [ ] Add screenshots, video, etc to chrome store
- Integrate:
  - [ ] `chrome.topSites`
  - [ ] research if `notes` is available. Does it add value? #Tags?
