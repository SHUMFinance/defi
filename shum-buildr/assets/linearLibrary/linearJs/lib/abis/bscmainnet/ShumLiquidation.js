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
        internalType: 'address',
        name: 'marker',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'liquidator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'debtBurnt',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'collateralCurrency',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'collateralWithdrawnFromStaked',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'collateralWithdrawnFromLocked',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'markerReward',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidatorReward',
        type: 'uint256'
      }
    ],
    name: 'PositionLiquidated',
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
        internalType: 'address',
        name: 'marker',
        type: 'address'
      }
    ],
    name: 'PositionMarked',
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
      }
    ],
    name: 'PositionUnmarked',
    type: 'event'
  },
  {
    inputs: [],
    name: 'BUILD_RATIO_KEY',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LIQUIDATION_DELAY_KEY',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LIQUIDATION_LIQUIDATOR_REWARD_KEY',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LIQUIDATION_MARKER_REWARD_KEY',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'LIQUIDATION_RATIO_KEY',
    outputs: [ { internalType: 'bytes32', name: '', type: 'bytes32' } ],
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
    inputs: [
      {
        internalType: 'contract IShumBuildBurnSystem',
        name: '_ShumBuildBurnSystem',
        type: 'address'
      },
      {
        internalType: 'contract IShumCollateralSystem',
        name: '_ShumCollateralSystem',
        type: 'address'
      },
      {
        internalType: 'contract IShumConfig',
        name: '_ShumConfig',
        type: 'address'
      },
      {
        internalType: 'contract IShumDebtSystem',
        name: '_ShumDebtSystem',
        type: 'address'
      },
      {
        internalType: 'contract IshumPrices',
        name: '_ShumPrices',
        type: 'address'
      },
      {
        internalType: 'contract IShumRewardLocker',
        name: '_ShumRewardLocker',
        type: 'address'
      },
      { internalType: 'address', name: '_admin', type: 'address' }
    ],
    name: '__ShumLiquidation_init',
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
    inputs: [ { internalType: 'address', name: 'user', type: 'address' } ],
    name: 'getUndercollateralizationMarkMarker',
    outputs: [ { internalType: 'address', name: '', type: 'address' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: 'user', type: 'address' } ],
    name: 'getUndercollateralizationMarkTimestamp',
    outputs: [ { internalType: 'uint256', name: '', type: 'uint256' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: 'user', type: 'address' } ],
    name: 'isPositionMarkedAsUndercollateralized',
    outputs: [ { internalType: 'bool', name: '', type: 'bool' } ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'sUSDToBurn', type: 'uint256' },
      {
        internalType: 'uint256[]',
        name: 'rewardEntryIds',
        type: 'uint256[]'
      }
    ],
    name: 'liquidatePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ShumBuildBurnSystem',
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
    inputs: [],
    name: 'ShumCollateralSystem',
    outputs: [
      {
        internalType: 'contract IShumCollateralSystem',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ShumConfig',
    outputs: [
      { internalType: 'contract IShumConfig', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ShumDebtSystem',
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
    inputs: [],
    name: 'shumPrices',
    outputs: [
      { internalType: 'contract IshumPrices', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ShumRewardLocker',
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
    inputs: [ { internalType: 'address', name: 'user', type: 'address' } ],
    name: 'markPositionAsUndercollateralized',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [ { internalType: 'address', name: 'user', type: 'address' } ],
    name: 'removeUndercollateralizationMark',
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
    inputs: [ { internalType: 'address', name: '', type: 'address' } ],
    name: 'undercollateralizationMarks',
    outputs: [
      { internalType: 'address', name: 'marker', type: 'address' },
      { internalType: 'uint64', name: 'timestamp', type: 'uint64' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];