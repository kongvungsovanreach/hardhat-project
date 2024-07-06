// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract STONE is ERC20 {
    constructor(uint256 initialSupply) ERC20('Stone Coin', 'STONE') {
        _mint(msg.sender, initialSupply);
    }
    // function decimals() public pure override returns (uint8) {
    //     return 18;
    // }
}

contract USD is ERC20 {
    constructor(uint256 initialSupply) ERC20('US Dollar', 'USD') {
        _mint(msg.sender, initialSupply);
    }
}