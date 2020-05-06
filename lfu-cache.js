const { DoublyLinkedList, Node } = require("./doubly-linked-list");

class CacheItem {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.freq = 1;
  }
}

class LFUCache {
  constructor(capacity) {
    this._size = 0;
    this._capacity = capacity;
    this._nodes = new Map();
    this._freqs = new Map();
    this._minFreq = 0;
  }

  get(key) {
    if (!this._nodes.has(key)) {
      return null;
    }

    const node = this._nodes.get(key);
    this._incFreq(node);
    return node.val.value;
  }

  put(key, value) {
    if (this._capacity === 0) {
      return;
    }

    // updating an existing key and increasing its value
    if (this._nodes.has(key)) {
      const node = this._nodes.get(key);
      this._incFreq(node);
      node.val.value = value;
      return;
    }

    // evict a node first since we're at capacity
    if (this._size === this._capacity) {
      const node = this._freqs.get(this._minFreq).pop();
      this._nodes.delete(node.val.key);
      this._size--;
    }

    // add new node
    const node = new Node(new CacheItem(key, value));
    this._nodes.set(key, node);
    this._getFreq(1).push(node);
    this._minFreq = 1;
    this._size++;
  }

  get capacity() {
    return this._capacity;
  }

  get size() {
    return this._size;
  }

  _getFreq(freq) {
    if (this._freqs.has(freq)) {
      return this._freqs.get(freq);
    }

    const dll = new DoublyLinkedList();
    this._freqs.set(freq, dll);
    return dll;
  }

  _incFreq(node) {
    const nodesAtFreq = this._freqs.get(node.val.freq);
    nodesAtFreq.pop(node);
    if (this._minFreq === node.val.freq && !nodesAtFreq.length) {
      this._minFreq++;
    }
    node.val.freq++;
    this._getFreq(node.val.freq).push(node);
  }
}

if (!module.parent) {
  const lfu = new LFUCache(2);
  lfu.put("a", 1);
  lfu.put("a", 2);
  console.log(lfu.get("a") === 2);
  lfu.put("b", 3);
  lfu.put("c", 4);
  console.log(lfu.get("c") === 4);
  console.log(lfu.get("b") == null);
}
