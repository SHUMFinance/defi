export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oldAdmin',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address'
      }
    ],
    name: 'AdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'currencyKey',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'bandCurrencyKey',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'BandOracleAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oldCandidate',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newCandidate',
        type: 'address'
      }
    ],
    name: 'CandidateChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'currencyKey',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'ChainlinkOracleAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldStalePeriod',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newStalePeriod',
        type: 'uint256'
      }
    ],
    name: 'GlobalStalePeriodUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'currencyKey',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address'
      }
    ],
    name: 'OracleRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'currencyKey',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldStalePeriod',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newStalePeriod',
        type: 'uint256'
      }
    ],
    name: 'StalePeriodOverrideUpdated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'sUSD',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ORACLE_TYPE_BAND',
    outputs: [ { internalType: 'uint8', name: '', type: 'uint8' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ORACLE_TYPE_CHAINLINK',
    outputs: [ { internalType: 'uint8', name: '', type: 'uint8' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: '_admin', type: 'address' } ],
    name: '__ShumAdminUpgradeable_init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: '_admin', type: 'address' } ],
    name: '__ShumOracleRouter_init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' },
      {
        internalType: 'string',
        name: 'bandCurrencyKey',
        type: 'string'
      },
      {
        internalType: 'address',
        name: 'oracleAddress',
        type: 'address'
      },
      { internalType: 'bool', name: 'removeExisting', type: 'bool' }
    ],
    name: 'addBandOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'currencyKeys',
        type: 'bytes32[]'
      },
      {
        internalType: 'string[]',
        name: 'bandCurrencyKeys',
        type: 'string[]'
      },
      {
        internalType: 'address[]',
        name: 'oracleAddresses',
        type: 'address[]'
      },
      { internalType: 'bool', name: 'removeExisting', type: 'bool' }
    ],
    name: 'addBandOracles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'oracleAddress',
        type: 'address'
      },
      { internalType: 'bool', name: 'removeExisting', type: 'bool' }
    ],
    name: 'addChainlinkOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'currencyKeys',
        type: 'bytes32[]'
      },
      {
        internalType: 'address[]',
        name: 'oracleAddresses',
        type: 'address[]'
      },
      { internalType: 'bool', name: 'removeExisting', type: 'bool' }
    ],
    name: 'addChainlinkOracles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [ { internalType: 'address', name: '', type: 'address' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'becomeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'candidate',
    outputs: [ { internalType: 'address', name: '', type: 'address' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'sourceKey', type: 'bytes32' },
      {
        internalType: 'uint256',
        name: 'sourceAmount',
        type: 'uint256'
      },
      { internalType: 'bytes32', name: 'destKey', type: 'bytes32' }
    ],
    name: 'exchange',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' }
    ],
    name: 'getPrice',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' }
    ],
    name: 'getPriceAndUpdatedTime',
    outputs: [
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'uint256', name: 'time', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' }
    ],
    name: 'getStalePeriodForCurrency',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'globalStalePeriod',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' }
    ],
    name: 'isPriceStaled',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    name: 'linearCurrencyKeysToBandCurrencyKeys',
    outputs: [ { internalType: 'string', name: '', type: 'string' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    name: 'oracleSettings',
    outputs: [
      { internalType: 'uint8', name: 'oracleType', type: 'uint8' },
      {
        internalType: 'address',
        name: 'oracleAddress',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' }
    ],
    name: 'removeOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_candidate', type: 'address' }
    ],
    name: 'setCandidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newStalePeriod',
        type: 'uint256'
      }
    ],
    name: 'setGlobalStalePeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' },
      {
        internalType: 'uint256',
        name: 'newStalePeriod',
        type: 'uint256'
      }
    ],
    name: 'setStalePeriodOverride',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    name: 'stalePeriodOverrides',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  }
];