#!/bin/bash

yarn scripts scripts/3dShumBuildBurnSystem.js  --network kovan &&
yarn scripts scripts/4dShumConfig.js --network kovan &&
yarn scripts scripts/5dShumAccessControl.js --network kovan && 
yarn scripts scripts/6adShumOracleRouter.js --network kovan &&
yarn scripts scripts/6arShumOracleRouterSetting.js --network kovan &&
yarn scripts scripts/6bdShumOraclePrice.js --network kovan &&
yarn scripts scripts/6brShumOraclePriceSetting.js --network kovan &&
yarn scripts scripts/7dShumDebtSystem.js --network kovan &&
yarn scripts scripts/8dShumCollateralSystem.js --network kovan &&
yarn scripts scripts/9dShumRewardLocker.js --network kovan &&
yarn scripts scripts/10dShumExchangeSystem.js --network kovan &&
yarn scripts scripts/11dShumLiquidation.js --network kovan &&
yarn scripts scripts/12cShumConfigSetting.js --network kovan &&
yarn scripts scripts/13cShumAccessControlSetting.js --network kovan &&
yarn scripts scripts/14cShumAssetSystemSetting.js --network kovan &&
yarn scripts scripts/15dUSDAndBTCDeployer.js --network kovan &&
yarn scripts scripts/15r1USDAndBTCSetting.js --network kovan &&
yarn scripts scripts/15r2ShumCollateralSystem.js --network kovan &&
yarn scripts scripts/16dShumRewardSystem.js --network kovan &&
yarn scripts scripts/16rShumAssetSystemSetting.js --network kovan

