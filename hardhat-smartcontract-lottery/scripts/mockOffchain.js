const { ethers, network, deployments } = require("hardhat")

async function mockKeepers() {
    const raffle = await ethers.getContract("Raffle")
    const checkData = ethers.keccak256(ethers.toUtf8Bytes(""))
    const { upkeepNeeded } = await raffle.checkUpkeep.staticCall(checkData)
    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData)
        const txReceipt = await tx.wait(1)
        const requestId = txReceipt.logs.find((e) => e.fragment?.name === "RequestedRaffleWinner")
            .args.requestId
        console.log(`Performed upkeep with RequestId: ${requestId}`)
        if (network.config.chainId == 31337 || network.name == "localhost") {
            const raffleDeployment = await deployments.get("Raffle")
            const subscriptionId = raffleDeployment.args[3]
            await mockVrf(requestId, raffle, subscriptionId)
        }
    } else {
        console.log("No upkeep needed!")
        // Check if we are stuck in CALCULATING state
        const raffleState = await raffle.getRaffleState()
        if (raffleState.toString() == "1") {
            console.log("Raffle is stuck in CALCULATING state! Retrieving last requestId...")
            const events = await raffle.queryFilter("RequestedRaffleWinner")
            if (events.length > 0) {
                const lastEvent = events[events.length - 1]
                const requestId = lastEvent.args.requestId
                console.log(`Found pending RequestId: ${requestId}, fulfilling now...`)
                const raffleDeployment = await deployments.get("Raffle")
                const subscriptionId = raffleDeployment.args[3]
                await mockVrf(requestId, raffle, subscriptionId)
            }
        }
    }
}

async function mockVrf(requestId, raffle, subscriptionId) {
    console.log("We on a local network? Ok let's pretend...")
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2_5Mock_Local")
    console.log(`Funding subscription ${subscriptionId} to avoid InsufficientBalance...`)
    // Fund with a lot more to be safe
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, ethers.parseUnits("100", 18))

    // Check balance
    const subInfo = await vrfCoordinatorV2Mock.getSubscription(subscriptionId)
    console.log(`Subscription Balance: ${ethers.formatUnits(subInfo.balance, 18)} LINK`)

    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.target)
    console.log("Responded!")
    const recentWinner = await raffle.getRecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
