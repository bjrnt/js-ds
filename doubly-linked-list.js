class Node {
  constructor(val) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    const sentinel = new Node(null, null);
    sentinel.prev = sentinel;
    sentinel.next = sentinel;
    this._sentinel = sentinel;
    this._length = 0;
  }

  /**
   * Push the given node onto the list.
   * O(1).
   */
  push(node) {
    node.next = this._sentinel;
    node.prev = this._sentinel.prev;
    this._sentinel.prev.next = node;
    this._sentinel.prev = node;
    this._length++;
  }

  /**
   * Pop the last or given node from the list.
   * O(1).
   */
  pop(node) {
    if (!node) {
      node = this._sentinel.next;
    }
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this._length--;
    return node;
  }

  /**
   * Remove and return the first element of the list.
   * O(1)
   */
  shift() {
    const node = this._sentinel.prev;
    node.prev.next = this._sentinel;
    this._sentinel.prev = node.prev;
    this._length--;
    return node;
  }

  /**
   * Adds an element to the beginning of the list.
   * O(1)
   */
  unshift(node) {
    node.prev = this._sentinel.prev;
    node.next = this._sentinel;
    this._sentinel.prev.next = node;
    this._sentinel.prev = node;
    this._length++;
  }

  *[Symbol.iterator]() {
    let node = this._sentinel.prev;
    while (node !== this._sentinel) {
      yield node;
      node = node.prev;
    }
  }

  /**
   * The length of the list.
   */
  get length() {
    return this._length;
  }
}

const dll = new DoublyLinkedList();
const fst = new Node(5);
const snd = new Node(6);
dll.push(fst);
dll.push(snd);
console.log(dll.pop() === fst); // true
console.log(dll.pop() === snd); // true
console.log(dll.length === 0); // true
dll.push(snd);
dll.unshift(fst);
console.log(Array.from(dll));
console.log(dll.shift() === fst); // true
