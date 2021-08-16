#!/bin/bash

yarn scripts scripts/0dSafeDecimalMath.js           --network bsc &&
yarn scripts scripts/1dShumFinance.js               --network bsc &&
yarn scripts scripts/2dShumAssetSystem.js           --network bsc &&
yarn scripts scripts/3dShumBuildBurnSystem.js       --network bsc &&
yarn scripts scripts/4dShumConfig.js                --network bsc &&
yarn scripts scripts/5dShumAccessControl.js         --network bsc &&
yarn scripts scripts/6dMockShumPrices.js            --network bsc &&
yarn scripts scripts/7dShumDebtSystem.js            --network bsc &&
yarn scripts scripts/8ShumCollateralSystem.js       --network bsc &&
yarn scripts scripts/9ShumRewardLocker.js           --network bsc &&
yarn scripts scripts/adShumExchangeSystem.js        --network bsc &&
yarn scripts scripts/bdShumLiquidation.js           --network bsc &&
yarn scripts scripts/ccShumConfigSetting.js         --network bsc &&
yarn scripts scripts/dcShumAccessControlSetting.js  --network bsc &&
yarn scripts scripts/ecShumAssetSystemSetting.js    --network bsc &&
yarn scripts scripts/fdUSDAndBTCDeployer.js         --network bsc &&
yarn scripts scripts/gcUSDAndBTCSetting.js          --network bsc &&
yarn scripts scripts/hcShumCollateralSystemUpdateTokenInfo.js   --network bsc &&
yarn scripts scripts/idShumRewardSystem.js          --network bsc &&
yarn scripts scripts/jcShumAssetSystemSetting.js    --network bsc 