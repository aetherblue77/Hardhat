const { expect } = require("chai")

describe("Chai Matcher Test", function () {
    it("should have revertedWith", function () {
        const p = Promise.reject(new Error("Test error"))
        // This is just a syntax check, not a real blockchain test
        console.log("revertedWith exists?", !!expect(p).to.be.revertedWith)
    })
})
