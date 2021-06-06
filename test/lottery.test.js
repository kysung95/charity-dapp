const { assert } = require("chai")
const assertRevert = require("./assertRevert")
const expectEvent = require("./expectEvent")
const Lottery = artifacts.require("Lottery")

contract("Lottery", function ([deployer, user1, user2]) {
  let lottery
  let betAmount = 5 * 10 ** 15
  let betAmountBN = new web3.utils.BN("5000000000000000")
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

  describe("Distribute", function () {
    describe("When the answer is checkable", function () {
      it("should give the user the pot when the answer matches", async () => {
        //두 글자 모두 다 맞았을 때

        await lottery.setAnswerForTest(
          "0xabfa535bc5b36b0e00ce5c574ecd6d1f5bd5fb131b875aac5d219c18121596a8",
          { from: deployer }
        )

        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xab", {
          from: user1,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        let potBefore = await lottery.getPot() //0.01ETH
        let user1BalanceBefore = await web3.eth.getBalance(user1)
        let receipt7 = await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        }) //정답체크는 7번 block으로부터
        let potAfter = await lottery.getPot() // 0ETH
        let user1BalanceAfter = await web3.eth.getBalance(user1) // ==before 0.015ETH
        //betAndDistribute
        //betAndDistribute
        //betAndDistribute
        //pot의 변화량 확인
        assert.equal(
          potBefore.toString(),
          new web3.utils.BN("10000000000000000").toString()
        )
        assert.equal(potAfter.toString(), new web3.utils.BN("0").toString())
        // assert.equal(potBefore,)

        user1BalanceBefore = new web3.utils.BN(user1BalanceBefore)
        assert.equal(
          user1BalanceBefore.add(potBefore).add(betAmountBN).toString(),
          new web3.utils.BN(user1BalanceAfter).toString()
        )
        //user(winner)의 밸런스를 확인
      })
      it("should give the user the amount he or she bet when a single character matches", async () => {
        await lottery.setAnswerForTest(
          "0xabfa535bc5b36b0e00ce5c574ecd6d1f5bd5fb131b875aac5d219c18121596a8",
          { from: deployer }
        )

        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xaf", {
          from: user1,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        let potBefore = await lottery.getPot() //0.01ETH
        let user1BalanceBefore = await web3.eth.getBalance(user1)
        let receipt7 = await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        }) //정답체크는 7번 block으로부터
        let potAfter = await lottery.getPot() // 0ETH
        let user1BalanceAfter = await web3.eth.getBalance(user1) // ==before 0.015ETH
        //betAndDistribute
        //betAndDistribute
        //betAndDistribute
        //pot의 변화량 확인
        assert.equal(potBefore.toString(), potAfter.toString())

        // assert.equal(potBefore,)

        user1BalanceBefore = new web3.utils.BN(user1BalanceBefore)
        assert.equal(
          user1BalanceBefore.add(betAmountBN).toString(),
          new web3.utils.BN(user1BalanceAfter).toString()
        )
      })
      it.only("should get the eth of user when the answer does not match at all", async () => {
        await lottery.setAnswerForTest(
          "0xabfa535bc5b36b0e00ce5c574ecd6d1f5bd5fb131b875aac5d219c18121596a8",
          { from: deployer }
        )

        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user1,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        })
        let potBefore = await lottery.getPot() //0.01ETH
        let user1BalanceBefore = await web3.eth.getBalance(user1)
        let receipt7 = await lottery.betAndDistribute("0xef", {
          from: user2,
          value: betAmount,
        }) //정답체크는 7번 block으로부터
        let potAfter = await lottery.getPot() // 0.015ETH
        let user1BalanceAfter = await web3.eth.getBalance(user1) // ==before
        //betAndDistribute
        //betAndDistribute
        //betAndDistribute
        //pot의 변화량 확인
        assert.equal(potBefore.add(betAmountBN).toString(), potAfter.toString())

        // assert.equal(potBefore,)

        user1BalanceBefore = new web3.utils.BN(user1BalanceBefore)
        assert.equal(
          user1BalanceBefore.toString(),
          new web3.utils.BN(user1BalanceAfter).toString()
        )
      })
    })
    describe("When the answer is not revealed(Not Mined)", function () {})
    describe("When the answer is not revealed(Block limit is passed)", function () {
        // 베팅과 상관없이 블락을 증가시킴
        // ganache에서 제공해주는 eth mining function을 사용하면 좋을듯!
    })
  })

  describe("isMatch", function () {
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
