import { LinkedListNode } from './linked_list_node'
import { IAddressReference } from '../../@types/objects'

// https://stackoverflow.com/a/48459059
export class Queue {
  private _length: number
  private _head: LinkedListNode<IAddressReference>
  private _tail: LinkedListNode<IAddressReference>

  constructor() {
    this._length = 0
    this._head = null
    this._tail = null
  }

  enqueue(ref: IAddressReference): void {
    const node = new LinkedListNode(ref)

    if (this._head === null) {
      this._head = this._tail = node
    } else {
      this._tail.next = node
      node.previous = this._tail
      this._tail = node
    }

    this._length++
  }

  dequeue(): IAddressReference {
    if (this.isEmpty()) throw new Error('Cannot dequeue an empty Queue')

    const item = this._head.item

    this._head = this._head.next

    if (this._head) this._head.previous = null

    this._length--

    if (this.isEmpty()) this._tail = null

    return item
  }

  isEmpty(): boolean {
    return !this._length
  }
}