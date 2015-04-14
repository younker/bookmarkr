'use strict';

class Meta {
  perform(action) {
    this[action]();
  }

  moveUp() {
    console.log('move up');
  }

  moveDown() {
    console.log('move down');
  }

  moveForward() {
    console.log('move forward');
  }

  moveBack() {
    console.log('move back');
  }

  cancel() {
    console.log('cancel');
  }
};

module.exports = Meta;
