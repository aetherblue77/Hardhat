const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

// describe("SimpleStorage", () => {})
describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async function () {
      const currentValue = await simpleStorage.retrieve()
      const expectedValue = "0"
      assert.equal(currentValue.toString(), expectedValue)
      // expect(currentValue.toString()).to.equal(expectedValue)
      // assert is the same thing with expect
    })

    it("Should update when we call store", async function (){
      const expectedValue = "7"
      const transactionResponse = await simpleStorage.store(expectedValue)
      await transactionResponse.wait(1)
      const currentValue = await simpleStorage.retrieve()
      assert.equal(currentValue.toString(), expectedValue)
      // expect(currentValue.toString()).to.equal(expectedValue)
      // assert is the same thing with expect
    })

    it("Should add a person and update mapping correctly", async function () {
      const expectedName = "Jojo"
      const expectedValue = "7"

      // Call add person
      const transaction = await simpleStorage.addPerson(expectedName, expectedValue)
      await transaction.wait(1)

      // cek array index 0
      const person = await simpleStorage.people(0)
      assert.equal(person.name, expectedName)
      assert.equal(person.favoriteNumber.toString(), expectedValue)

      // Cek mapping nameToFavoriteNumber
      const storedNumber = await simpleStorage.nameToFavoriteNumber(expectedName)
      assert.equal(storedNumber.toString(), expectedValue)
    })
})
