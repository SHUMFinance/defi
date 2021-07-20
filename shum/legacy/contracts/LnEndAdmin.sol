// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./ShumAdmin.sol";

contract ShumEndAdmin {
    constructor() public {}

    function becomeAdmin(address target) external {
        ShumAdmin(target).becomeAdmin();
    }
}
