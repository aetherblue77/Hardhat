const { developmentChains } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")

const BASE_FEE = "100000000000000000" // 0.1 LINK (Premium)
const GAS_PRICE_LINK = 1e9 // 1 gwei (Link per gas)
const WEI_PER_UNIT_LINK = "4000000000000000" // 0.004 ETH per LINK (Price Example)

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK, WEI_PER_UNIT_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // deploy a mock vrfcoordinator...
        await deploy("VRFCoordinatorV2_5Mock_Local", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Mocks deployed!")
        log("--------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
