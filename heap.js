// Stripped down version of https://github.com/ignlg/heap-js/

class Heap {
  /**
   * Heap instance constructor.
   * @param  {Function} compare Optional comparison function, defaults to Heap.minComparator<number>
   */
  constructor(compare = Heap.minComparator) {
    this.compare = compare;
    this.heapArray = [];
  }

  /**
   * Gets children indices for given index.
   * @param  {Number} idx     Parent index
   * @return {Array(Number)}  Array of children indices
   */
  static getChildrenIndexOf(idx) {
    return [idx * 2 + 1, idx * 2 + 2];
  }

  /**
   * Gets parent index for given index.
   * @param  {Number} idx  Children index
   * @return {Number | undefined}      Parent index, -1 if idx is 0
   */
  static getParentIndexOf(idx) {
    if (idx <= 0) {
      return -1;
    }
    const whichChildren = idx % 2 ? 1 : 2;
    return Math.floor((idx - whichChildren) / 2);
  }

  /**
   * Gets sibling index for given index.
   * @param  {Number} idx  Children index
   * @return {Number | undefined}      Sibling index, -1 if idx is 0
   */
  static getSiblingIndexOf(idx) {
    if (idx <= 0) {
      return -1;
    }
    const whichChildren = idx % 2 ? 1 : -1;
    return idx + whichChildren;
  }

  /**
   * Min heap comparison function, default.
   * @param  {any} a     First element
   * @param  {any} b     Second element
   * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
   */
  static minComparator(a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Max heap comparison function.
   * @param  {any} a     First element
   * @param  {any} b     Second element
   * @return {Number}    0 if they're equal, positive if `a` goes up, negative if `b` goes up
   */
  static maxComparator(a, b) {
    if (b > a) {
      return 1;
    } else if (b < a) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Adds an element to the heap.
   * @param {any} element Element to be added
   * @return {Boolean} true
   */
  push(element) {
    this._sortNodeUp(this.heapArray.push(element) - 1);
    return true;
  }

  /**
   * Remove all of the elements from this heap.
   */
  clear() {
    this.heapArray = [];
  }

  clone() {
    const cloned = new Heap(this.comparator());
    cloned.heapArray = this.toArray();
    return cloned;
  }

  /**
   * Test if the heap has no elements.
   * @return {Boolean} True if no elements on the heap
   */
  isEmpty() {
    return this.length === 0;
  }

  /**
   * Length of the heap.
   * @return {Number}
   */
  get length() {
    return this.heapArray.length;
  }

  /**
   * Top node. Aliases: `element`.
   * Same as: `top(1)[0]`
   * @return {any} Top node
   */
  peek() {
    return this.heapArray[0];
  }

  /**
   * Extract the top node (root).
   * @return {any} Extracted top node, undefined if empty
   */
  pop() {
    const pop = this.heapArray.pop();
    if (this.length > 0 && pop !== undefined) {
      return this.replace(pop);
    }
    return pop;
  }

  replace(element) {
    const peek = this.heapArray[0];
    this.heapArray[0] = element;
    this._sortNodeDown(0);
    return peek;
  }

  /**
   * Clone the heap's internal array
   * @return {Array}
   */
  toArray() {
    return this.heapArray.slice(0);
  }

  toString() {
    return this.heapArray.toString();
  }

  /**
   * Get the elements of these node's children
   * @param  {Number} idx Node index
   * @return {Array(any)}  Children elements
   */
  getChildrenOf(idx) {
    return Heap.getChildrenIndexOf(idx)
      .map((i) => this.heapArray[i])
      .filter((e) => e !== undefined);
  }

  /**
   * Get the element of this node's parent
   * @param  {Number} idx Node index
   * @return {any}     Parent element
   */
  getParentOf(idx) {
    const pi = Heap.getParentIndexOf(idx);
    return this.heapArray[pi];
  }

  /**
   * Iterator interface
   */
  *[Symbol.iterator]() {
    while (this.length) {
      yield this.pop();
    }
  }

  /**
   * Move a node to a new index, switching places
   * @param  {Number} j First node index
   * @param  {Number} k Another node index
   */
  _moveNode(j, k) {
    [this.heapArray[j], this.heapArray[k]] = [
      this.heapArray[k],
      this.heapArray[j],
    ];
  }

  /**
   * Move a node down the tree (to the leaves) to find a place where the heap is sorted.
   * @param  {Number} i Index of the node
   */
  _sortNodeDown(i) {
    let moveIt = i < this.heapArray.length - 1;
    let moved = false;
    const self = this.heapArray[i];

    const getPotentialParent = (best, j) => {
      if (
        typeof this.heapArray[j] !== "undefined" &&
        this.compare(this.heapArray[j], this.heapArray[best]) < 0
      ) {
        best = j;
      }
      return best;
    };

    while (moveIt) {
      const childrenIdx = Heap.getChildrenIndexOf(i);
      const bestChildIndex = childrenIdx.reduce(
        getPotentialParent,
        childrenIdx[0]
      );
      const bestChild = this.heapArray[bestChildIndex];
      if (
        typeof bestChild !== "undefined" &&
        this.compare(self, bestChild) > 0
      ) {
        this._moveNode(i, bestChildIndex);
        i = bestChildIndex;
        moved = true;
      } else {
        moveIt = false;
      }
    }
    return moved;
  }

  /**
   * Move a node up the tree (to the root) to find a place where the heap is sorted.
   * @param  {Number} i Index of the node
   */
  _sortNodeUp(i) {
    let moveIt = i > 0;
    let moved = false;
    while (moveIt) {
      const pi = Heap.getParentIndexOf(i);
      if (pi >= 0 && this.compare(this.heapArray[pi], this.heapArray[i]) > 0) {
        this._moveNode(i, pi);
        i = pi;
        moved = true;
      } else {
        moveIt = false;
      }
    }
    return moved;
  }
}
