type tKey = string | number;

class Node<tV> {
  constructor(
    public key: tKey = null,
    public value: tV = null,
    public next: Node<tV> = null,
    public prev: Node<tV> = null,
  ) {}
}

export class LRUCache<tCacheVal = unknown> {
  private size = 0;

  constructor(
    private capacity = 100,
    private cache: Record<tKey, Node<tCacheVal>> = {},
    private head = new Node<tCacheVal>(), // lru
    private tail = new Node<tCacheVal>(), // mru
  ) {}

  public put(key: tKey, value: tCacheVal): void {
    let node = this.cache[key];

    if (node) {
      node.value = value;

      this.promote(node);
    } else {
      node = new Node(key, value);
      this.append(node);
    }
  }

  public get(key: tKey): tCacheVal | -1 {
    const node = this.cache[key];

    if (!node) return -1;

    this.promote(node);

    return node.value;
  }

  private promote(node: Node<tCacheVal>) {
    this.evict(node);
    this.append(node);
  }

  private append(node: Node<tCacheVal>) {
    this.cache[node.key] = node;

    if (!this.head.next) {
      this.head.next = node;
      this.tail.prev = node;
      node.prev = this.head;
      node.next = this.tail;
    } else {
      const oldTail = this.tail.prev;
      oldTail.next = node;
      node.prev = oldTail;
      node.next = this.tail;
      this.tail.prev = node;
    }

    this.size += 1;

    if (this.size > this.capacity) {
      this.evict(this.head.next);
    }
  }

  private evict(node: Node<tCacheVal>) {
    delete this.cache[node.key];
    this.size -= 1;

    if (this.head.next === node && this.tail.prev === node) {
      this.head.next = null;
      this.tail.prev = null;
      this.size = 0;
      return;
    }

    if (this.head.next === node) {
      this.head.next = node.next;
      node.next.prev = this.head;
      return;
    }

    if (this.tail.prev === node) {
      this.tail.prev = node.prev;
      node.prev.next = this.tail;
      return;
    }

    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}
