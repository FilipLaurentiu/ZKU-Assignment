//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract HelloWorld {
    /// @notice storage variable used to store the number
    uint private storedNumber;

    /// @notice external function used to store a number in the contract
    /// @param _number the uint256 number to be stored
    function storeNumber(uint _number) external {
        storedNumber = _number;
    }

    /// @notice external function that return the stored number from the contract
    function retrieveNumber() external view returns(uint){
        return storedNumber;
    }
}
