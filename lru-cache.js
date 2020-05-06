const { DoublyLinkedList, Node } = require("./doubly-linked-list");

class CacheItem {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class LRUCache {
  constructor(capacity) {
    this._capacity = capacity;
    this.nodesList = new DoublyLinkedList();
    this.nodeMap = new Map();
  }

  get(key) {
    if (!this.nodeMap.has(key)) {
      return null;
    }

    const node = this.nodeMap.get(key);
    this.nodesList.pop(node);
    this.nodesList.push(node);
    return node.val.value;
  }

  put(key, value) {
    let node;
    if (this.nodeMap.has(key)) {
      node = this.nodeMap.get(key);
      this.nodesList.pop(node);
      node.val.value = value;
    } else {
      if (this.nodesList.length === this._capacity) {
        this._evictLeastRecent();
      }
      node = new Node(new CacheItem(key, value));
      this.nodeMap.set(key, node);
    }

    this.nodesList.push(node);
  }

  _evictLeastRecent() {
    const evictedNode = this.nodesList.pop();
    this.nodeMap.delete(evictedNode.val.key);
  }
}

if (!module.parent) {
  const lru = new LRUCache(2);
  lru.put("a", 1);
  lru.put("b", 2);
  console.log(lru.get("a") === 1); // true
  lru.put("c", 3);
  console.log(lru.get("b") === null); // true
  lru.put("c", 4);
  console.log(lru.get("c") === 4); // true
}
