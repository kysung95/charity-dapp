const Web3 = require("web3")

let web3

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //We are in the browser and metamask is running
  web3 = new Web3(window.web3.currentProvider)
} else {
  //we are not on the browser OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/ca3cf83bcc384e43a424683b3be881ec"
  )
  web3 = new Web3(provider)
}

export default web3
