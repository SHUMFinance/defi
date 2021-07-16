// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./interfaces/IShumAddressStorage.sol";

abstract contract ShumAddressCache {
    function updateAddressCache(IShumAddressStorage _addressStorage) external virtual;

    event CachedAddressUpdated(bytes32 name, address addr);
}
