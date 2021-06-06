import { useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"

import Web3 from "web3"

let lotteryAddress = "0x1A089a4eA352AE5887f3bdc4d5706C096ef07462"
let lotteryABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bettor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "challenges",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "answerBlockNumber",
        type: "uint256",
      },
    ],
    name: "BET",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bettor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "challenges",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "answer",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "answerBlockNumber",
        type: "uint256",
      },
    ],
    name: "DRAW",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bettor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "challenges",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "answer",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "answerBlockNumber",
        type: "uint256",
      },
    ],
    name: "FAIL",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bettor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "challenges",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "answerBlockNumber",
        type: "uint256",
      },
    ],
    name: "REFUND",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bettor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "challenges",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "bytes1",
        name: "answer",
        type: "bytes1",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "answerBlockNumber",
        type: "uint256",
      },
    ],
    name: "WIN",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "answerForTest",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address payable", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getPot",
    outputs: [{ internalType: "uint256", name: "pot", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "bytes1", name: "challenges", type: "bytes1" }],
    name: "betAndDistribute",
    outputs: [{ internalType: "bool", name: "result", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "bytes1", name: "challenges", type: "bytes1" }],
    name: "bet",
    outputs: [{ internalType: "bool", name: "result", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "distribute",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "bytes32", name: "answer", type: "bytes32" }],
    name: "setAnswerForTest",
    outputs: [{ internalType: "bool", name: "result", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "bytes1", name: "challenges", type: "bytes1" },
      { internalType: "bytes32", name: "answer", type: "bytes32" },
    ],
    name: "isMatch",
    outputs: [
      { internalType: "enum Lottery.BettingResult", name: "", type: "uint8" },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getBetInfo",
    outputs: [
      { internalType: "uint256", name: "answerBlockNumber", type: "uint256" },
      { internalType: "address", name: "bettor", type: "address" },
      { internalType: "bytes1", name: "challenges", type: "bytes1" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]
function App() {
  useEffect(async () => {
    await initWeb3()
  }, [])

  const initWeb3 = async () => {
    if (window.ethereum) {
      console.log("ethereum")
      window.web3 = new Web3(window.ethereum)
      try {
        window.ethereum.enable().then(function () {
          // User has allowed account access to DApp...
        })
      } catch (e) {
        // User has denied account access to DApp...
        console.log("user denied account access")
      }
    }
    // Legacy DApp Browsers
    else if (window.web3) {
      console.log("web3")
      window.web3 = new Web3(window.web3.currentProvider)
    }
    // Non-DApp Browsers
    else {
      alert("You have to install MetaMask !")
    }

    let accounts = await window.web3.eth.getAccounts()
    let account = accounts[0]

    let lotteryContract = new window.web3.eth.Contract(
      lotteryABI,
      lotteryAddress
    )

    let pot = await lotteryContract.methods.getPot().call()
    console.log("pot입니당", pot)
  }

  const bet = async () => {
    let lotteryContract = new window.web3.eth.Contract(
      lotteryABI,
      lotteryAddress
    )
    let accounts = await window.web3.eth.getAccounts()
    let account = accounts[0]
    let nonce = await window.web3.eth.getTransactionCount(account)
    lotteryContract.methods
      .betAndDistribute("0xcd")
      .send({
        from: account,
        value: 5000000000000000,
        gas: 300000,
        nonce: nonce,
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
