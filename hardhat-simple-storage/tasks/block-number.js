const { TASK_COMPILE_GET_REMAPPINGS } = require("hardhat/builtin-tasks/task-names")
const { task } = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    // const blockTask = async () => {}
    // async function blockTask() {}
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log("Current block number:",blockNumber);
    }
)

module.exports = {}