'use strict';

import NodePath from './node_path';

class TreeMapper {
  constructor(tree) {
    this.tree = tree;
    this.collection = this.parse();
  }

  filter(query) {
    return this.collection.filter((nodepath) => {
      return nodepath.looseMatch(query);
    }).sort(function(a, b) {
      return b.matchScore(query) - a.matchScore(query);
    });
  }

  parse() {
    let collection = [];

    var b = (node, path) => {
      path.push(node.title);

      if ( this.nodeHasChildren(node) ) {
        node.children.forEach((child) => {
          let copy = path.slice(0);
          b(child, copy);
        });
      } else {
        let nodePath = new NodePath(node.id, node.url, path, 'bookmark');
        collection.push(nodePath);
      }
    };

    b(this.tree[0], []);

    return collection;
  }

  nodeHasChildren(node) {
    return node['children'] && node.children.length > 0;
  }

  addNode(node) {
    this.collection.push(node);
  }
}

module.exports = TreeMapper;
