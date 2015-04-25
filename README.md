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
- Score:
  - [x] For each match outside a run (the first entry is a locations entry), if it is preceeded by a '/', it should get a higher score
  - [ ] persist previous queries and the selected item. Make them first in line
- [ ] ES6ify / Polish code
- [ ] Add screenshots, video, etc to chrome store
- Integrate:
  - [x] `chrome.history`
  - [ ] `chrome.topSites`
  - [ ] research if `notes` is available. Does it add value? #Tags?
- [ ] Vertically center selected option for long lists
- [ ] Add search symbols. For example:
  - [ ] `h:jsvid` will only look in `history` for js videos
  - [ ] `b:jsvid` will only look in `bookmarks` for js videos
