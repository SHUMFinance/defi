// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./interfaces/IShumAccessControl.sol";
import "./ShumAddressCache.sol";
import "./upgradeable/ShumAdminUpgradeable.sol";

/**
 * @title ShumAssetUpgradeable
 *
 * @dev This is an upgradeable version of `ShumAsset`.
 */
contract ShumAssetUpgradeable is ERC20Upgradeable, ShumAdminUpgradeable, ShumAddressCache {
    bytes32 mKeyName;
    IShumAccessControl accessCtrl;

    bytes32 private constant ROLE_ISSUE_ASSET = "ISSUE_ASSET";
    bytes32 private constant ROLE_BURN_ASSET = "BURN_ASSET";
    bytes32 private constant ROLE_MOVE_ASSET = "MOVE_ASSET";

    modifier onlyIssueAssetRole() {
        require(accessCtrl.hasRole(ROLE_ISSUE_ASSET, msg.sender), "ShumAssetUpgradeable: not ISSUE_ASSET role");
        _;
    }

    modifier onlyBurnAssetRole() {
        require(accessCtrl.hasRole(ROLE_BURN_ASSET, msg.sender), "ShumAssetUpgradeable: not BURN_ASSET role");
        _;
    }

    modifier onlyMoveAssetRole() {
        require(accessCtrl.hasRole(ROLE_MOVE_ASSET, msg.sender), "ShumAssetUpgradeable: not MOVE_ASSET role");
        _;
    }

    function __ShumAssetUpgradeable_init(
        bytes32 _key,
        string memory _name,
        string memory _symbol,
        address _admin
    ) public initializer {
        __ERC20_init(_name, _symbol);
        __ShumAdminUpgradeable_init(_admin);

        mKeyName = _key;
    }

    function keyName() external view returns (bytes32) {
        return mKeyName;
    }

    function updateAddressCache(IShumAddressStorage _addressStorage) public override onlyAdmin {
        accessCtrl = IShumAccessControl(
            _addressStorage.getAddressWithRequire("ShumAccessControl", "ShumAccessControl address not valid")
        );

        emit CachedAddressUpdated("ShumAccessControl", address(accessCtrl));
    }

    function mint(address account, uint256 amount) external onlyIssueAssetRole {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyBurnAssetRole {
        _burn(account, amount);
    }

    function move(
        address from,
        address to,
        uint256 amount
    ) external onlyMoveAssetRole {
        _transfer(from, to, amount);
    }

    // Reserved storage space to allow for layout changes in the future.
    uint256[48] private __gap;
}
