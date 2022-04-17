const { expect } = require("chai");
const { ethers, network } = require("hardhat");

async function increase_block_timestamp(time) {
    return network.provider.send("evm_increaseTime", [time]);
}


describe("Ballot", function () {
    let startTime;
    let BallotContract;
    let chairperson, user1, user2, user3, user4;

    const proposals = [
        "first", "second", "third", "forth"
    ];

    before(async () => {
        [chairperson, user1, user2, user3, user4] = await ethers.getSigners();
    });

    it("Should deploy and init the contract", async () => {
        const Ballot = await ethers.getContractFactory("Ballot");
        BallotContract = await Ballot.deploy(proposals.map(proposalName => ethers.utils.formatBytes32String(proposalName)));
        const deployTx = await (await BallotContract.deployed()).deployTransaction.wait();
        startTime = await BallotContract.startTime();
        const deployBlock = await ethers.provider.getBlock(deployTx.blockNumber);

        expect(deployBlock.timestamp).to.equal(startTime.toNumber());

        const deployer = await BallotContract.chairperson();
        expect(deployer).to.equal(chairperson.address);


        await BallotContract.giveRightToVote(user1.address);
        await BallotContract.giveRightToVote(user2.address);
        await BallotContract.giveRightToVote(user3.address);
        await BallotContract.giveRightToVote(user4.address);
    });

    it("Should allow voters to vote until the vote period end", async () => {
        await BallotContract.connect(user1).vote(0);
        await BallotContract.connect(user2).delegate(user3.address);
        await BallotContract.connect(user3).vote(1);
    });

    it("Should not allow the user to vote after the period end", async () => {
        const five_minutes = 1 + 60 * 5;
        await increase_block_timestamp(five_minutes);
        await expect(BallotContract.connect(user4).vote(0)).revertedWith("Vote already ended");
    });

    it("Proposal 1 should win", async () => {
        const winningProposal = await BallotContract.winningProposal();
        expect(winningProposal).to.equal(1);
    });
});
