const assertRevert = require("./assertRevert")
const expectEvent = require("./expectEvent")
const Lottery = artifacts.require("Lottery")

contract("Lottery", function ([deployer, user1, user2]) {
  let lottery
  let betAmount = 5 * 10 ** 15
  let bet_block_interval = 3
  beforeEach(async () => {
    lottery = await Lottery.new()
  })

  it("getPot should return current pot", async () => {
    let pot = await lottery.getPot()

    assert.equal(pot, 0)
  })

  describe("Bet", function () {
    it("should fail when the bet money is not 0.005 ETH", async () => {
      await assertRevert(
        lottery.bet("0xab", { from: user1, value: 4000000000000000 })
      )
    })
    it("should put the bet to the bet queue with 1 bet", async () => {
      let receipt = await lottery.bet("0xab", {
        from: user1,
        value: betAmount,
      })
      //   console.log(receipt)
      let pot = await lottery.getPot()
      assert.equal(pot, 0)
      let contractBalance = await web3.eth.getBalance(lottery.address)
      assert.equal(contractBalance, betAmount)

      let currentBlockNumber = await web3.eth.getBlockNumber()
      let bet = await lottery.getBetInfo(0)
      assert.equal(
        bet.answerBlockNumber,
        currentBlockNumber + bet_block_interval
      )
      assert.equal(bet.bettor, user1)
      assert.equal(bet.challenges, "0xab")

      //check log
      await expectEvent.inLogs(receipt.logs, "BET")
    })
  })

  describe.only("isMatch", function () {
    let blockHash =
      "0xabfa535bc5b36b0e00ce5c574ecd6d1f5bd5fb131b875aac5d219c18121596a8"
    it("should be BettingResult.Win when two characters match", async () => {
      let matchingResult = await lottery.isMatch("0xab", blockHash)
      assert.equal(matchingResult, 1)
    })
    it("should be BettingResult.Win when two characters match", async () => {
      let matchingResult = await lottery.isMatch("0xcd", blockHash)
      assert.equal(matchingResult, 0)
    })
    it("should be BettingResult.Win when two characters match", async () => {
      let matchingResult = await lottery.isMatch("0xaf", blockHash)
      assert.equal(matchingResult, 2)

      matchingResult = await lottery.isMatch("0xfb", blockHash)
      assert.equal(matchingResult, 2)
    })
  })
})
