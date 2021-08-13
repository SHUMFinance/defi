// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24;

interface IShumPrices {
    function getPrice(bytes32 currencyKey) external view returns (uint);

    function exchange(
        bytes32 sourceKey,
        uint sourceAmount,
        bytes32 destKey
    ) external view returns (uint);

    function SUSD() external view returns (bytes32);
}
