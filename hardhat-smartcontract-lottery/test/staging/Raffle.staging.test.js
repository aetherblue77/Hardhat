const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
const { Result } = require("ethers")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink Keepers adn Chainlink VRF, we get a random winner", async function () {
                  // enter the raffle
                  console.log("Setting up test...")
                  const startingTimeStamp = await raffle.getLatestTimeStamp()
                  const accounts = await ethers.getSigners()

                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              // add our asserts here
                              console.log("1. Mengambil data Pemenang...")
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await ethers.provider.getBalance(
                                  accounts[0].address,
                              )
                              const endingTimeStamp = await raffle.getLatestTimeStamp()

                              console.log("Mengecek Assertions dasar...")
                              await expect(raffle.getPlayers(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)

                              console.log("Mengecek balance...")
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  (winnerStartingBalance + raffleEntranceFee).toString(),
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              console.log("4. Assertion selesai!")
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                      })
                      // Then entering the raffle
                      console.log("Entering Raffle...")
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(1)
                      console.log("Ok, time to wait...")
                      const winnerStartingBalance = await ethers.provider.getBalance(
                          accounts[0].address,
                      )
                      // and this code WONT complete until our listener has finished listening!
                  })
              })
          })
      })
