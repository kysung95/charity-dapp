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
    address public owner;

    uint256 internal constant BLOCK_LIMIT = 256;
    uint256 internal constant BET_BLOCK_INTERVAL = 3;
    uint256 internal constant BET_AMOUNT = 5 * 10**15;
    uint256 private _pot;

    enum BlockStatus {Checkable, NotRevealed, BlockLimitPassed}
    enum BettingResult {Fail, Win, Draw}
    event BET(
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
    function distribute() public {
        // head 3 4 5 6 7 8 9 10 11 12 tail
        uint256 cur;
        BetInfo memory b;
        BlockStatus currentBlockStatus;
        for (cur = _head; cur < _tail; cur++) {
            b = _bets[cur];
            currentBlockStatus = getBlockStatus(b.answerBlockNumber);
            //Checkable
            if (currentBlockStatus == BlockStatus.Checkable) {}
            //Not Revealed
            if (currentBlockStatus == BlockStatus.NotRevealed) {}
            //Block Limit Passed
            if (currentBlockStatus == BlockStatus.BlockLimitPassed) {
                //refund
                //emit refund
            }
            popBet(cur);

            //check the answer
        }
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
