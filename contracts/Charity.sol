pragma solidity ^0.4.20;

contract CharityFactory {
    address[] public deployedCharities;

    function createCharity() public {
        address newCharity = new Charity(msg.sender);
        deployedCharities.push(newCharity);
    }

    function getDeployedCharity() public view returns (address[]) {
        return deployedCharities;
    }
}

contract Charity {
    event CharityEvent(
        address _from,
        string _message,
        string _username,
        uint256 _value
    );

    struct Donator {
        string message;
        string username;
        uint256 value;
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
        charityCount++;

        emit CharityEvent(msg.sender, message, username, value);
        Donator memory newDonator =
            Donator({message: message, username: username, value: value});
        donators.push(newDonator);
    }
}
