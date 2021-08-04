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
        name: 'name',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'CachedAddressUpdated',
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
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_currency',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_userTotal',
        type: 'uint256'
      }
    ],
    name: 'CollateralLog',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'fromUser',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'toUser',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'currency',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'CollateralMoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_currency',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_userTotal',
        type: 'uint256'
      }
    ],
    name: 'RedeemCollateral',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'symbol',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAddr',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minCollateral',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'close',
        type: 'bool'
      }
    ],
    name: 'UpdateTokenSetting',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_currency', type: 'bytes32' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'Collateral',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'Currency_ETH',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'Currency_LINA',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'GetSystemTotalCollateralInUsd',
    outputs: [ { internalType: 'uint256', name: 'rTotal', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'bytes32', name: '_currency', type: 'bytes32' }
    ],
    name: 'GetUserCollateral',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: '_user', type: 'address' } ],
    name: 'GetUserCollaterals',
    outputs: [
      { internalType: 'bytes32[]', name: '', type: 'bytes32[]' },
      { internalType: 'uint256[]', name: '', type: 'uint256[]' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: '_user', type: 'address' } ],
    name: 'GetUserTotalCollateralInUsd',
    outputs: [ { internalType: 'uint256', name: 'rTotal', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: '_user', type: 'address' } ],
    name: 'IsSatisfyTargetRatio',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bytes32', name: '_currency', type: 'bytes32' }
    ],
    name: 'MaxRedeemable',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: '_user', type: 'address' } ],
    name: 'MaxRedeemableInUsd',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_currency', type: 'bytes32' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'Redeem',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'bytes32', name: '_currency', type: 'bytes32' } ],
    name: 'RedeemMax',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_currency', type: 'bytes32' },
      { internalType: 'address', name: '_tokenAddr', type: 'address' },
      {
        internalType: 'uint256',
        name: '_minCollateral',
        type: 'uint256'
      },
      { internalType: 'bool', name: '_close', type: 'bool' }
    ],
    name: 'UpdateTokenInfo',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: '_symbols',
        type: 'bytes32[]'
      },
      {
        internalType: 'address[]',
        name: '_tokenAddrs',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '_minCollateral',
        type: 'uint256[]'
      },
      { internalType: 'bool[]', name: '_closes', type: 'bool[]' }
    ],
    name: 'UpdateTokenInfos',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'nonpayable',
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
    name: '__ShumCollateralSystem_init',
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
    name: 'buildBurnSystem',
    outputs: [
      {
        internalType: 'contract IShumBuildBurnSystem',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'burnAmount', type: 'uint256' },
      {
        internalType: 'bytes32',
        name: 'unstakeCurrency',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: 'unstakeAmount',
        type: 'uint256'
      }
    ],
    name: 'burnAndUnstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'burnAmount', type: 'uint256' },
      {
        internalType: 'bytes32',
        name: 'unstakeCurrency',
        type: 'bytes32'
      }
    ],
    name: 'burnAndUnstakeMax',
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
    inputs: [],
    name: 'debtSystem',
    outputs: [
      {
        internalType: 'contract IShumDebtSystem',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: '_user', type: 'address' } ],
    name: 'getUserLinaCollateralBreakdown',
    outputs: [
      { internalType: 'uint256', name: 'staked', type: 'uint256' },
      { internalType: 'uint256', name: 'locked', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'liquidation',
    outputs: [ { internalType: 'address', name: '', type: 'address' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'mConfig',
    outputs: [
      { internalType: 'contract IShumConfig', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'mRewardLocker',
    outputs: [
      {
        internalType: 'contract IShumRewardLocker',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_currency', type: 'bytes32' },
      { internalType: 'address[]', name: '_users', type: 'address[]' },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]'
      }
    ],
    name: 'migrateCollateral',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'fromUser', type: 'address' },
      { internalType: 'address', name: 'toUser', type: 'address' },
      { internalType: 'bytes32', name: 'currency', type: 'bytes32' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'moveCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'priceGetter',
    outputs: [
      { internalType: 'contract ILnPrices', name: '', type: 'address' }
    ],
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
    inputs: [ { internalType: 'bool', name: '_paused', type: 'bool' } ],
    name: 'setPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'stakeCurrency',
        type: 'bytes32'
      },
      { internalType: 'uint256', name: 'stakeAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'buildAmount', type: 'uint256' }
    ],
    name: 'stakeAndBuild',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'stakeCurrency',
        type: 'bytes32'
      },
      { internalType: 'uint256', name: 'stakeAmount', type: 'uint256' }
    ],
    name: 'stakeAndBuildMax',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    name: 'tokenInfos',
    outputs: [
      { internalType: 'address', name: 'tokenAddr', type: 'address' },
      {
        internalType: 'uint256',
        name: 'minCollateral',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalCollateral',
        type: 'uint256'
      },
      { internalType: 'bool', name: 'bClose', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    name: 'tokenSymbol',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'uniqueId',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IShumAddressStorage',
        name: '_addressStorage',
        type: 'address'
      }
    ],
    name: 'updateAddressCache',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'bytes32', name: '', type: 'bytes32' }
    ],
    name: 'userCollateralData',
    outputs: [
      { internalType: 'uint256', name: 'collateral', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];