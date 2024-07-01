// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Lending {
    IERC20 public STONE;
    IERC20 public USD;
    address public owner;
    uint256 public constant COLLATERALIZATION_RATIO = 666; // 66.6% 담보 비율 (1000 = 100%)
    uint256 public constant T_GPC_PRICE = 7524; // tGPC의 가격 (소수점 4자리)

    mapping(address => uint256) public tGPCBalances;
    mapping(address => uint256) public tUSDTLoans;

    event Deposited(address indexed user, uint256 amount);
    event Loaned(address indexed user, uint256 amount);

    constructor(IERC20 stone, IERC20 usd) {
        STONE = stone;
        USD = usd;
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(STONE.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        tGPCBalances[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    function borrow(uint256 tUSDTAmount) external {
        uint256 requiredCollateral = getCollateralAmount(tUSDTAmount);
        require(tGPCBalances[msg.sender] >= requiredCollateral, "Not enough collateral");

        tGPCBalances[msg.sender] -= requiredCollateral;
        tUSDTLoans[msg.sender] += tUSDTAmount;
        require(USD.transfer(msg.sender, tUSDTAmount), "Transfer failed");

        emit Loaned(msg.sender, tUSDTAmount);
    }

    function getCollateralAmount(uint256 tUSDTAmount) public pure returns (uint256) {
        return (tUSDTAmount * 10000 * 1000) / (T_GPC_PRICE * COLLATERALIZATION_RATIO);
    }

    // repay: tUSDT 대출금을 상환하면 담보물인 tGPC를 되돌려준다.
    function repay(uint256 tUSDTAmount) external {
        require(tUSDTLoans[msg.sender] >= tUSDTAmount, "Not enough loan amount");

        uint256 requiredCollateral = getCollateralAmount(tUSDTAmount);
        tUSDTLoans[msg.sender] -= tUSDTAmount;
        tGPCBalances[msg.sender] += requiredCollateral;
        require(USD.transferFrom(msg.sender, address(this), tUSDTAmount), "Transfer failed");

        emit Loaned(msg.sender, tUSDTAmount);
    }

}