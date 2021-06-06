pragma solidity >=0.4.21 <0.6.0;

contract Lottery {
    struct BetInfo {
        uint256 answerBlockNumber;
        address payable bettor;
        byte challenges;
    }

    uint256 private _tail;
    uint256 private _head;
    mapping(uint256 => BetInfo) private _bets;
    address payable public owner;

    uint256 internal constant BLOCK_LIMIT = 256;
    uint256 internal constant BET_BLOCK_INTERVAL = 3;
    uint256 internal constant BET_AMOUNT = 5 * 10**15;
    uint256 private _pot;
    bool private mode = false; //false:test mode,true: publish mode
    bytes32 public answerForTest;
    enum BlockStatus {Checkable, NotRevealed, BlockLimitPassed}
    enum BettingResult {Fail, Win, Draw}
    event BET(
        uint256 index,
        address bettor,
        uint256 amount,
        byte challenges,
        uint256 answerBlockNumber
    );
    event WIN(
        uint256 index,
        address bettor,
        uint256 amount,
        byte challenges,
        byte answer,
        uint256 answerBlockNumber
    );
    event FAIL(
        uint256 index,
        address bettor,
        uint256 amount,
        byte challenges,
        byte answer,
        uint256 answerBlockNumber
    );
    event DRAW(
        uint256 index,
        address bettor,
        uint256 amount,
        byte challenges,
        byte answer,
        uint256 answerBlockNumber
    );
    event REFUND(
        uint256 index,
        address bettor,
        uint256 amount,
        byte challenges,
        uint256 answerBlockNumber
    );

    constructor() public {
        owner = msg.sender;
    }

    function getPot() public view returns (uint256 pot) {
        return _pot;
    }

    /**
     * @dev 베팅과 정답 체크를 한다. 유저는 0.005 eth를 보내야 하고, 베팅용 1byte 글자를 내보냄.
     * @param challenges 유저가 베팅하는 글자
     * @return 함수가 잘 수행되었는지 확인하는 bool 값
     */
    function betAndDistribute(byte challenges)
        public
        payable
        returns (bool result)
    {
        bet(challenges);
        distribute();

        return true;
    }

    //Bet
    /**
     * @dev 베팅을 한다.
     * @param challenges 유저가 베팅하는 글자
     * @return 함수가 잘 수행되었는지 확인하는 bool 값
     */
    function bet(byte challenges) public payable returns (bool result) {
        //check the proper ether is sent
        require(msg.value == BET_AMOUNT, "NOT enough ETH");

        require(pushBet(challenges), "Fail to add");

        emit BET(
            _tail - 1,
            msg.sender,
            msg.value,
            challenges,
            block.number + BET_BLOCK_INTERVAL
        );
        return true;
    }

    //save the bet to the queue
    //Distribute
    /**
     * @dev 베팅 결과값을 확인하고 팟머니 분배
     * 정답실패: 팟머니 축척, 정답 맞춤: 팟머니 획득, 한글자 맞춤 or 확인불가: 환불
     */
    function distribute() public {
        // head 3 4 5 6 7 8 9 10 11 12 tail
        uint256 cur;
        uint256 transferAmount;
        BetInfo memory b;
        BlockStatus currentBlockStatus;
        BettingResult currentBettingResult;
        for (cur = _head; cur < _tail; cur++) {
            b = _bets[cur];
            currentBlockStatus = getBlockStatus(b.answerBlockNumber);
            //Checkable
            if (currentBlockStatus == BlockStatus.Checkable) {
                bytes32 answerBlockHash =
                    getAnswerBlockHash(b.answerBlockNumber);
                currentBettingResult = isMatch(b.challenges, answerBlockHash);
                if (currentBettingResult == BettingResult.Win) {
                    transferAmount = transferAfterPayingFee(
                        b.bettor,
                        _pot + BET_AMOUNT
                    );
                    _pot = 0; //보안적으로 더 안전한 방법은 pot을 먼저 초기화하는 것이다.

                    emit WIN(
                        cur,
                        b.bettor,
                        transferAmount,
                        b.challenges,
                        answerBlockHash[0],
                        b.answerBlockNumber
                    );
                }
                if (currentBettingResult == BettingResult.Fail) {
                    _pot += BET_AMOUNT;
                    emit FAIL(
                        cur,
                        b.bettor,
                        0,
                        b.challenges,
                        answerBlockHash[0],
                        b.answerBlockNumber
                    );
                }
                if (currentBettingResult == BettingResult.Draw) {
                    transferAmount = transferAfterPayingFee(
                        b.bettor,
                        BET_AMOUNT
                    );
                    emit DRAW(
                        cur,
                        b.bettor,
                        transferAmount,
                        b.challenges,
                        answerBlockHash[0],
                        b.answerBlockNumber
                    );
                }
            }
            //Not Revealed
            if (currentBlockStatus == BlockStatus.NotRevealed) {
                break;
            }
            //Block Limit Passed
            if (currentBlockStatus == BlockStatus.BlockLimitPassed) {
                //refund
                transferAmount = transferAfterPayingFee(b.bettor, BET_AMOUNT);
                //emit refund
                emit REFUND(
                    cur,
                    b.bettor,
                    transferAmount,
                    b.challenges,
                    b.answerBlockNumber
                );
            }
            popBet(cur);

            //check the answer
        }
        _head = cur;
    }

    function transferAfterPayingFee(address payable addr, uint256 amount)
        internal
        returns (uint256)
    {
        uint256 fee = 0;
        uint256 amountWithoutFee = amount - fee;

        //transfer to addr

        addr.transfer(amountWithoutFee);
        //transfer to owner
        owner.transfer(fee);

        return amountWithoutFee;
    }

    function setAnswerForTest(bytes32 answer) public returns (bool result) {
        require(
            msg.sender == owner,
            "Only owner can set the answer for test mode"
        );
        answerForTest = answer;
        return true;
    }

    function getAnswerBlockHash(uint256 answerBlockNumber)
        internal
        view
        returns (bytes32 answer)
    {
        return mode ? blockhash(answerBlockNumber) : answerForTest;
    }

    /**
     * @dev challenges 베팅 글자와 정답 확인
     * @param challenges 베팅 글자와 정답 확인
     * @param answer block hash
     * @return result
     */
    function isMatch(byte challenges, bytes32 answer)
        public
        pure
        returns (BettingResult)
    {
        byte c1 = challenges;
        byte c2 = challenges;
        byte a1 = answer[0];
        byte a2 = answer[0];

        c1 = c1 >> 4;
        c1 = c1 << 4;

        a1 = a1 >> 4;
        a1 = a1 << 4;

        c2 = c2 << 4;
        c2 = c2 >> 4;

        a2 = a2 << 4;
        a2 = a2 >> 4;

        if (a1 == c1 && a2 == c2) {
            return BettingResult.Win;
        }

        if (a1 == c1 || a2 == c2) {
            return BettingResult.Draw;
        }

        return BettingResult.Fail;
    }

    function getBlockStatus(uint256 answerBlockNumber)
        internal
        view
        returns (BlockStatus)
    {
        if (
            block.number > answerBlockNumber &&
            block.number < BLOCK_LIMIT + answerBlockNumber
        ) {
            return BlockStatus.Checkable;
        }
        if (block.number <= answerBlockNumber) {
            return BlockStatus.NotRevealed;
        }
        if (block.number >= answerBlockNumber + BLOCK_LIMIT) {
            return BlockStatus.BlockLimitPassed;
        }
        return BlockStatus.BlockLimitPassed;
    }

    //check the answer
    function getBetInfo(uint256 index)
        public
        view
        returns (
            uint256 answerBlockNumber,
            address bettor,
            byte challenges
        )
    {
        BetInfo memory b = _bets[index];
        answerBlockNumber = b.answerBlockNumber;
        bettor = b.bettor;
        challenges = b.challenges;
    }

    function pushBet(byte challenges) internal returns (bool) {
        BetInfo memory b;
        b.bettor = msg.sender; //20 byte
        b.answerBlockNumber = block.number + BET_BLOCK_INTERVAL; //32byte 20000gas
        b.challenges = challenges;

        _bets[_tail] = b;
        _tail++; //32byte
        return true;
    }

    function popBet(uint256 index) internal returns (bool) {
        delete _bets[index];
        return true;
    }
}
