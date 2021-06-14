const Charity = artifacts.require("Charity.sol")
const CharityFactory = artifacts.require("CharityFactory.sol")

module.exports = function (deployer) {
  deployer.deploy(CharityFactory, Charity)
}
