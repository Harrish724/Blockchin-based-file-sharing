const { ethers } = require("hardhat");

async function mineBlocksEvery10Seconds() {
    console.log("Starting automatic block mining...");

    setInterval(async () => {
        await ethers.provider.send("evm_mine");
        const latestBlock = await ethers.provider.getBlock("latest");
        console.log("New block mined at:", latestBlock.timestamp);
    }, 10000); // Mines a block every 10 seconds
}

mineBlocksEvery10Seconds();
