const { getNamedAccounts, deployments, ethers } = require("hardhat")

async function main() {
    const deployer = await getNamedAccounts()
    let fundMe = await deployments.get("FundMe")
    fundMe = await ethers.getContractAt(fundMe.abi, fundMe.address)
    console.log("Funding...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Got it back!")
}

main().catch((error) => console.error(error))
