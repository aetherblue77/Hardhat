const { getNamedAccounts, ethers, deployments } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    let fundMe = await deployments.get("FundMe")
    fundMe = await ethers.getContractAt(fundMe.abi, fundMe.address)
    console.log("Funding Contract...")
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionResponse.wait(1)
    console.log("Funded!")
}

main().catch((error) => console.error(error))
