// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main(){
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.waitForDeployment()
    console.log("Deploy Contract to:", await simpleStorage.getAddress())
    // What happens when we deploy to our hardhat network??
    if(network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        const deployTransaction = simpleStorage.deploymentTransaction()
        await deployTransaction.wait(6)
        await verify(await simpleStorage.getAddress(), [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)
    
    // Update the Current Value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Update Value is: ${updatedValue}`)
}

async function verify(contractAddress, args){
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    }catch (e) {
        if(e.message.toLowerCase().includes("already verified")){
            console.log("Already Verified!")
        } else {
          console.log(e);  
        }
    }
}

// main
main().catch((error) => console.error(error));