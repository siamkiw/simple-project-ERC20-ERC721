// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "hardhat/console.sol";

contract AccessControlToken is ERC20, AccessControlEnumerable {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant FOO_ROLE = keccak256("FOO_ROLE");
    bytes32 public constant BAR_ROLE = keccak256("BAR_ROLE");
    bytes32 public constant ZOO_ROLE = keccak256("ZOO_ROLE");

    constructor(uint256 initialSupply) ERC20("Gold", "GLD"){
        _mint(msg.sender, initialSupply);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(FOO_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(BAR_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(ZOO_ROLE, DEFAULT_ADMIN_ROLE);
    }

    function mint(address toAddress, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(toAddress, amount);
    }

    function foo() public view onlyRole(FOO_ROLE) returns (string memory){
        return "You are FOO_ROLE";
    }

    function bar() public view onlyRole(BAR_ROLE) returns (string memory){
        return "You are BAR_ROLE";
    }

    function zoo() public view  returns (string memory){
        require(hasRole(ZOO_ROLE, msg.sender), "You are not ZOO_ROLE.");
        return "You are ZOO_ROLE";
    }

    function anyoneCanCall() public pure returns (string memory){
        return "Anyone can call this function.";
    }
}