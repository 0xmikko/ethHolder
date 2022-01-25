// SPDX-License-Identifier: GPL-2.0
pragma solidity ^0.8.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title Chainlink price feed mock
 * @notice Used for test purposes only
 * @author Gearbox
 */
contract ChainlinkPriceFeedMock is AggregatorV3Interface {
    int256 private price;
    int256 private oldPrice;
    uint8 public immutable override decimals;

    uint80 private constant _roundId = 80000;

    constructor(int256 _price, uint8 _decimals) {
        price = _price;
        decimals = _decimals;
    }

    function description() external pure override returns (string memory) {
        return "price oracle";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function setPrice(int256 newPrice) external {
        price = newPrice;
    }

    function setOldPrice(int256 newPrice) external {
        oldPrice = newPrice;
    }

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 roundId)
        external
        view
        override
        returns (
            uint80, // roundId,
            int256, // answer,
            uint256, // startedAt,
            uint256, // updatedAt,
            uint80 // answeredInRound
        )
    {
        return (
            roundId,
            oldPrice,
            uint256(block.timestamp - 1 days - 3600 * roundId),
            uint256(block.timestamp - 1 days - 3600 * roundId),
            roundId - 2
        );
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80, // roundId,
            int256, // answer,
            uint256, // startedAt,
            uint256, // updatedAt,
            uint80 //answeredInRound
        )
    {
        return (
            _roundId,
            price,
            uint256(block.timestamp),
            uint256(block.timestamp),
            _roundId - 2
        );
    }
}
