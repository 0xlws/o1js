import { Field, Bool } from '../lib/core.js';
import * as Json from './gen/transaction-json.js';
import { UInt32, UInt64, Sign } from '../lib/int.js';
import { TokenSymbol } from '../lib/hash.js';
import { PublicKey } from '../lib/signature.js';
import { ProvableExtended, Provables, provable } from '../lib/circuit_value.js';
import * as Encoding from '../lib/encoding.js';

export {
  PublicKey,
  Field,
  Bool,
  AuthRequired,
  AuthorizationKind,
  UInt64,
  UInt32,
  Sign,
  TokenId,
  Undefined,
};

export { Events, Events as SequenceEvents, StringWithHash, TokenSymbol };

export { TypeMap };

type Undefined = undefined;

type AuthRequired = {
  constant: Bool;
  signatureNecessary: Bool;
  signatureSufficient: Bool;
};

type AuthorizationKind = { isSigned: Bool; isProved: Bool };

type TokenId = Field;

// to what types in the js layout are mapped
type TypeMap = {
  PublicKey: PublicKey;
  Field: Field;
  Bool: Bool;
  AuthRequired: AuthRequired;
  AuthorizationKind: AuthorizationKind;
  UInt32: UInt32;
  UInt64: UInt64;
  Sign: Sign;
  TokenId: TokenId;
};

// types that implement AsFieldAndAux, and so can be left out of the conversion maps below
// sort of a "transposed" representation

let emptyType = {
  sizeInFields: () => 0,
  toFields: () => [],
  toAuxiliary: () => [],
  fromFields: () => null,
  check: () => {},
  toInput: () => ({}),
  toJSON: () => null,
};

const TokenId = {
  ...provable(Field),
  toJSON(x: TokenId): Json.TokenId {
    return Encoding.TokenId.toBase58(x);
  },
};

const AuthRequired = {
  ...provable(
    { constant: Bool, signatureNecessary: Bool, signatureSufficient: Bool },
    {
      customObjectKeys: [
        'constant',
        'signatureNecessary',
        'signatureSufficient',
      ],
    }
  ),
  toJSON(x: AuthRequired): Json.AuthRequired {
    let c = Number(x.constant.toBoolean());
    let n = Number(x.signatureNecessary.toBoolean());
    let s = Number(x.signatureSufficient.toBoolean());
    // prettier-ignore
    switch (`${c}${n}${s}`) {
      case '110': return 'Impossible';
      case '101': return 'None';
      case '000': return 'Proof';
      case '011': return 'Signature';
      case '001': return 'Either';
      default: throw Error('Unexpected permission');
    }
  },
};

const AuthorizationKind = {
  ...provable(
    { isSigned: Bool, isProved: Bool },
    {
      customObjectKeys: ['isSigned', 'isProved'],
    }
  ),
  toJSON(x: AuthorizationKind): Json.AuthorizationKind {
    let isSigned = Number(x.isSigned.toBoolean());
    let isProved = Number(x.isProved.toBoolean());
    // prettier-ignore
    switch (`${isSigned}${isProved}`) {
      case '00': return 'None_given';
      case '10': return 'Signature';
      case '01': return 'Proof';
      default: throw Error('Unexpected authorization kind');
    }
  },
};

const TypeMap: {
  [K in keyof TypeMap]: ProvableExtended<TypeMap[K], Json.TypeMap[K]>;
} = {
  Field,
  Bool,
  UInt32,
  UInt64,
  Sign,
  TokenId,
  AuthRequired,
  AuthorizationKind,
  PublicKey,
};

// types which got an annotation about its circuit type in Ocaml

const Events = Provables.dataAsHash({
  emptyValue: [],
  toJSON(data: Field[][]) {
    return data.map((row) => row.map((e) => e.toString()));
  },
});
const StringWithHash = Provables.dataAsHash({
  emptyValue: '',
  toJSON(data: string) {
    return data;
  },
});
