// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

/**
 * @title MockLShumRewardLocker
 *
 * @dev A mock LShumRewardLocker contract for testing. We wouldn't need this
 * contract if Hardhat supported Waffle's `calledOnContractWith` on mocks.
 */
contract MockShumRewardLocker {
    struct AppendRewardArgs {
        address _user;
        uint256 _amount;
        uint256 _lockTo;
    }

    AppendRewardArgs[] appendRewardCalls;

    function lastAppendRewardCall()
        public
        view
        returns (
            address _user,
            uint256 _amount,
            uint256 _lockTo
        )
    {
        AppendRewardArgs memory args = appendRewardCalls[appendRewardCalls.length - 1];
        return (args._user, args._amount, args._lockTo);
    }

    function addReward(
        address _user,
        uint256 _amount,
        uint256 _lockTo
    ) external {
        appendRewardCalls.push(AppendRewardArgs({_user: _user, _amount: _amount, _lockTo: _lockTo}));
    }
}
