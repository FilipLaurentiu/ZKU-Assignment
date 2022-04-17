//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract HelloWorld {
    uint private storedNumber;


    function storeNumber(uint _number) external {
        storedNumber = _number;
    }

    function retrieveNumber() external view returns(uint){
        return storedNumber;
    }
}
