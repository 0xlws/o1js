import { Hash, Field, Provable, UInt8 } from 'snarkyjs';

console.log('Running SHA224 test');
Provable.runAndCheck(() => {
  let digest = Hash.SHA224([Field(1), Field(30000), new UInt8(2)]);
  Provable.log(digest);
});

console.log('Running SHA256 test');
Provable.runAndCheck(() => {
  let digest = Hash.SHA256([Field(1), Field(1), new UInt8(2)]);
  Provable.log(digest);
});

console.log('Running SHA384 test');
Provable.runAndCheck(() => {
  let digest = Hash.SHA384([Field(1), Field(1), new UInt8(2)]);
  Provable.log(digest);
});

console.log('Running SHA512 test');
Provable.runAndCheck(() => {
  let digest = Hash.SHA512([Field(1), Field(1), new UInt8(2)]);
  Provable.log(digest);
});

console.log('Running Poseidon test');
Provable.runAndCheck(() => {
  let digest = Hash.Poseidon([Field(1), Field(1), Field(2)]);
  Provable.log(digest);
});

console.log('Running default hash test');
Provable.runAndCheck(() => {
  let digest = Hash.default([Field(1), Field(1), Field(2)]);
  Provable.log(digest);
});

console.log('Running keccack hash test');
Provable.runAndCheck(() => {
  let digest = Hash.Keccack256([Field(1), Field(1), new UInt8(2)]);
  Provable.log(digest);
});
