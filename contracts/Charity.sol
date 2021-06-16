pragma solidity ^0.4.20;

contract CharityFactory {
    address[] public deployedCharities;

    function createCharity() public {
        //기부 생성
        address newCharity = new Charity(msg.sender);
        deployedCharities.push(newCharity);
    }

    function getDeployedCharity() public view returns (address[]) {
        return deployedCharities;
    }
}

contract Charity {
    event CharityEvent( //이벤트 객체
        address _from,
        string _message, //기부 카드에 포함될 메시지
        string _username, //기부 카드에 포함될 유저이름
        uint256 _value //기부 금액
    );

    struct Donator {
        string message; //기부 카드에 포함될 메시지
        string username; //기부 카드에 포함될 유저이름
        uint256 value; //기부 금액
    }

    address public organization;
    Donator[] public donators;
    uint256 public charityCount;

    function Charity(address creator) public {
        organization = creator;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (this.balance, donators.length, charityCount);
    }

    function contributeMessage(
        string message,
        string username,
        uint256 value
    ) public payable {
        charityCount++; //기부 인원 추가

        emit CharityEvent(msg.sender, message, username, value);
        Donator memory newDonator =
            Donator({message: message, username: username, value: value});
        donators.push(newDonator);
    }
}
