const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld", function () {
  it("Should return the new greeting once it's changed", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const helloWorldContract = await HelloWorld.deploy();
    await helloWorldContract.deployed();

    const number = 10;
    const setNumberTx = await helloWorldContract.storeNumber(number);

    // wait until the transaction is mined
    await setNumberTx.wait();

    expect(await helloWorldContract.retrieveNumber()).to.equal(number);
  });
});
