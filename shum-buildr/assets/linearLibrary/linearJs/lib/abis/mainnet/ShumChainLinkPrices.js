export default [
  {
    inputs: [
      { internalType: 'address', name: '_admin', type: 'address' },
      { internalType: 'address', name: '_oracle', type: 'address' },
      {
        internalType: 'bytes32[]',
        name: '_currencies',
        type: 'bytes32[]'
      },
      { internalType: 'uint256[]', name: '_prices', type: 'uint256[]' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
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
        internalType: 'address',
        name: 'Oracle',
        type: 'address'
      }
    ],
    name: 'OracleAdded',
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
        name: 'Oracle',
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
        internalType: 'address',
        name: 'newOracle',
        type: 'address'
      }
    ],
    name: 'OracleUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'currencyName',
        type: 'bytes32'
      }
    ],
    name: 'PriceDeleted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32[]',
        name: 'currencyNames',
        type: 'bytes32[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'newPrices',
        type: 'uint256[]'
      }
    ],
    name: 'PricesUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'priceStalePeriod',
        type: 'uint256'
      }
    ],
    name: 'StalePeriodUpdated',
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
    name: 'candidateChanged',
    type: 'event'
  },
  {
    inputs: [],
    name: 'LINA',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
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
      {
        internalType: 'bytes32',
        name: 'currencyName',
        type: 'bytes32'
      }
    ],
    name: 'deletePrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'sourceName', type: 'bytes32' },
      {
        internalType: 'uint256',
        name: 'sourceAmount',
        type: 'uint256'
      },
      { internalType: 'bytes32', name: 'destName', type: 'bytes32' }
    ],
    name: 'exchange',
    outputs: [ { internalType: 'uint256', name: 'value', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'sourceName', type: 'bytes32' },
      {
        internalType: 'uint256',
        name: 'sourceAmount',
        type: 'uint256'
      },
      { internalType: 'bytes32', name: 'destName', type: 'bytes32' }
    ],
    name: 'exchangeAndPrices',
    outputs: [
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'sourcePrice', type: 'uint256' },
      { internalType: 'uint256', name: 'destPrice', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'currencyName',
        type: 'bytes32'
      }
    ],
    name: 'getCurrentRoundId',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'currencyName',
        type: 'bytes32'
      }
    ],
    name: 'getPrice',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'currencyName',
        type: 'bytes32'
      }
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
      {
        internalType: 'bytes32',
        name: 'currencyName',
        type: 'bytes32'
      }
    ],
    name: 'isStale',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    name: 'mOracleArray',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    name: 'mOracles',
    outputs: [
      {
        internalType: 'contract OracleInterface',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    name: 'mPricesLastRound',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'oracle',
    outputs: [ { internalType: 'address', name: '', type: 'address' } ],
    stateMutability: 'view',
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
    inputs: [ { internalType: 'address', name: '_oracle', type: 'address' } ],
    name: 'setOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'uint256', name: '_time', type: 'uint256' } ],
    name: 'setStalePeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'stalePeriod',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: 'currencyNames',
        type: 'bytes32[]'
      },
      {
        internalType: 'uint256[]',
        name: 'newPrices',
        type: 'uint256[]'
      },
      { internalType: 'uint256', name: 'timeSent', type: 'uint256' }
    ],
    name: 'updateAll',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' },
      {
        internalType: 'address',
        name: 'OracleAddress',
        type: 'address'
      }
    ],
    name: 'addOracle',
    outputs: [],
    stateMutability: 'nonpayable',
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
  }
];