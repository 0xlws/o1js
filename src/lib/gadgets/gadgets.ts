/**
 * Wrapper file for various gadgets, with a namespace and doccomments.
 */
import { rangeCheck64 } from './range-check.js';
import { xor } from './bitwise.js';
import { Field } from '../core.js';

export { Gadgets };

const Gadgets = {
  /**
   * Asserts that the input value is in the range [0, 2^64).
   *
   * This function proves that the provided field element can be represented with 64 bits.
   * If the field element exceeds 64 bits, an error is thrown.
   *
   * @param x - The value to be range-checked.
   *
   * @throws Throws an error if the input value exceeds 64 bits.
   *
   * @example
   * ```ts
   * const x = Provable.witness(Field, () => Field(12345678n));
   * rangeCheck64(x); // successfully proves 64-bit range
   *
   * const xLarge = Provable.witness(Field, () => Field(12345678901234567890123456789012345678n));
   * rangeCheck64(xLarge); // throws an error since input exceeds 64 bits
   * ```
   *
   * **Note**: Small "negative" field element inputs are interpreted as large integers close to the field size,
   * and don't pass the 64-bit check. If you want to prove that a value lies in the int64 range [-2^63, 2^63),
   * you could use `rangeCheck64(x.add(1n << 63n))`.
   */
  rangeCheck64(x: Field) {
    return rangeCheck64(x);
  },

  /**
   * Bitwise XOR gadget on {@link Field} elements. Equivalent to the [bitwise XOR `^` operator in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR).
   * A XOR gate works by comparing two bits and returning `1` if two bits differ, and `0` if two bits are equal.
   *
   * This gadget builds a chain of XOR gates recursively. Each XOR gate can verify 16 bit at most. If your input elements exceed 16 bit, another XOR gate will be added to the chain.
   *
   * The `length` parameter lets you define how many bits should be compared. The output is not constrained to the length.
   *
   * **Note:** Specifying a larger `length` parameter adds additional constraints.
   *
   * **Note:** Both {@link Field} elements need to fit into `2^length - 1`, or the operation will fail.
   * For example, for `length = 2` ( 2² = 4), `.xor` will fail for any element that is larger than `> 3`.
   *
   * ```typescript
   * let a = Field(5);    // ... 000101
   * let b = Field(3);    // ... 000011
   *
   * let c = xor(a, b, 2);    // ... 000110
   * c.assertEquals(6);
   * ```
   */
  xor(a: Field, b: Field, length: number) {
    return xor(a, b, length);
  },
};
