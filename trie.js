// Based on https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0

class TrieNode {
  constructor(key, parent) {
    this.key = key;
    this.parent = parent || null;
    this.children = {};
    this.end = false;
  }

  /**
   * Iterates through parents to find the word.
   * O(k), k = word length
   */
  getWord() {
    const chars = [];
    let node = this;

    while (node != null) {
      chars.unshift(node.key);
      node = node.parent;
    }

    return chars.join("");
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode(null);
  }

  /**
   * Inserts a word into the trie in O(length)
   * @param {*} word
   */
  insert(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children[char]) {
        node.children[char] = new TrieNode(char, node);
      }
      node = node.children[char];
      if (i === word.length - 1) {
        node.end = true;
      }
    }
  }

  /**
   * Checks whether the given word is contained within the trie.
   * O(length).
   */
  contains(word) {
    let node = this.root;
    for (let char of word) {
      if (node.children[char]) {
        node = node.children[char];
      } else {
        return false;
      }
    }
    return node.end;
  }

  /**
   * Removes the given word from the trie.
   * O(length).
   */
  remove(word) {
    let node = this.root;

    for (let char of word) {
      if (node.children[char]) {
        node = node.children[char];
      } else {
        // word does not exist in trie
        return;
      }
    }

    // if the current node is a part of other longer words mark it as no longer being the end of one
    if (Object.keys(node).length > 0) {
      node.end = false;
      return;
    }

    // walk up towards the root as long as the deleted word was the only existing word
    while (node.parent != null) {
      const parent = node.parent;
      delete parent.children[node.key];
      if (Object.keys(parent.children).length === 0) {
        node = parent;
      }
    }
  }

  /**
   * Finds all words in the trie with the given prefix.
   * O(p + n), p = prefix length. n = number of child paths
   * @param {*} prefix
   */
  withPrefix(prefix) {
    let node = this.root;

    for (let char of prefix) {
      if (node.children[char]) {
        node = node.children[char];
      } else {
        return [];
      }
    }

    let words = [];
    this.wordsFromNode(node, words);
    return words;
  }

  wordsFromNode(node, words) {
    if (node.end) {
      words.unshift(node.getWord());
    }

    for (let child in node.children) {
      this.wordsFromNode(node.children[child], words);
    }
  }
}

const trie = new Trie();
trie.insert("hello");
trie.insert("helium");
console.log(trie.contains("helium")); // true
console.log(trie.contains("helios")); // false
console.log(trie.withPrefix("hel")); // ['helium', 'hello']
trie.remove("helium");
console.log(trie.contains("hello")); // true
console.log(trie.contains("helium")); // false
console.log(trie.withPrefix("he")); // ['hello']
