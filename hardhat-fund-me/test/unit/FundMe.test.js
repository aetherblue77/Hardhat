const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.parseEther("1") // 1 ETH

          beforeEach(async function () {
              // deploy our FundMe contract using Hardhat-deploy
              // take the developer accounts

              deployer = (await getNamedAccounts()).deployer
              // deploy all contract with tag "all"
              await deployments.fixture(["all"])

              // take the contract when was deployed
              fundMe = await deployments.get("FundMe")
              mockV3Aggregator = await deployments.get("MockV3Aggregator")

              // Convert to ethers contract:
              fundMe = await ethers.getContractAt(fundMe.abi, fundMe.address)
              mockV3Aggregator = await ethers.getContractAt(
                  mockV3Aggregator.abi,
                  mockV3Aggregator.address,
              )
          })

          describe("constructor", function () {
              it("set the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.target)
              })
          })

          describe("fund", async function () {
              it("Fails if you don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!",
                  )
              })

              it("updated the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response =
                      await fundMe.getAddressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("Adds funder to array of getFunder", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("Withdraw ETH from a single founder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance, 0n)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  )
              })

              it("Cheaper Withdraw ETH from a single founder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance, 0n)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  )
              })

              it("allows us to withdraw with multiple getFunder", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt
                  const gasCost = gasUsed * gasPrice

                  // Assert
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  assert.equal(endingFundMeBalance, 0n)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  )

                  // Make sure that the getFunder are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 0; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })

              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1],
                  )
                  await expect(
                      fundMeConnectedContract.withdraw(),
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })

              it("Cheaper Withdraw testing...", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt
                  const gasCost = gasUsed * gasPrice

                  // Assert
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  assert.equal(endingFundMeBalance, 0n)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  )

                  // Make sure that the getFunder are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 0; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
          })
      })
