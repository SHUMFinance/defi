// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

interface IShumAssetSystem {
    function totalAssetsInUsd() external view returns (uint256 rTotal);
}
