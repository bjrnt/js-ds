class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this._sentinel = new Node(null);
    this._length = 0;
  }

  /**
   * Insert the node at the beginning of the list
   * O(1)
   */
  shift(node) {
    node.next = this._sentinel.next;
    this._sentinel.next = node;
    this._length++;
    return node;
  }

  /**
   * Remove and return the node at the beginning of the list
   * O(1)
   */
  unshift() {
    const node = this._sentinel.next;
    this._sentinel.next = node.next;
    this._length--;
    return node;
  }

  *[Symbol.iterator]() {
    let node = this._sentinel.next;
    while (node != null) {
      yield node;
      node = node.next;
    }
  }

  get length() {
    return this._length;
  }
}

const ll = new LinkedList();
ll.shift(new Node(5));
ll.shift(new Node(4));
ll.shift(new Node(3));
console.log(ll.unshift().val === 3); // true
ll.shift(new Node(2));
ll.shift(new Node(1));
console.log(ll.length === 3); // true
console.log(Array.from(ll)); // [2,4,5]
