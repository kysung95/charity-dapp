import { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"
import "bootstrap/dist/css/bootstrap.css"
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
  const [betRecords, setBetRecords] = useState([])
  const [winRecords, setWinRecords] = useState([])
  const [failRecords, setFailRecords] = useState([])
  const [pot, setPot] = useState(0)
  const [challenges, setChallenges] = useState(["A", "B"])
  const [finalRecord, setFinalRecord] = useState([
    {
      bettor: "0xabcd...",
      index: "0",
      challenges: "ab",
      answer: "ab",
      targetBlockNumber: "10",
      pot: "0",
    },
  ])
  useEffect(async () => {
    await initWeb3()
    await getBetEvents()
    pollData()
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
  }

  const getPot = async () => {
    let lotteryContract = new window.web3.eth.Contract(
      lotteryABI,
      lotteryAddress
    )

    let pot = await lotteryContract.methods.getPot().call()
    let potEther = window.web3.utils.fromWei(pot, "ether")
    setPot(potEther)
  }

  const pollData = async () => {
    await getPot()
    await getBetEvents()
    await getWinEvents()
    await getFailEvents()
  }

  const getBetEvents = async () => {
    let lotteryContract = new window.web3.eth.Contract(
      lotteryABI,
      lotteryAddress
    )
    const records = []
    let events = await lotteryContract.getPastEvents("BET", {
      fromBlock: 0,
      toBlock: "latest",
    })

    for (let i = 0; i < events.length; i += 1) {
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString()
      record.bettor = events[i].returnValues.bettor
      record.betBlockNumber = events[i].blockNumber
      record.targetBlockNumber =
        events[i].returnValues.answerBlockNumber.toString()
      record.challenges = events[i].returnValues.challenges
      record.win = "Not Revealed"
      record.answer = "0x00"
      records.unshift(record)
    }
    console.log("기록은?", records)
    setBetRecords(records)
  }

  const getWinEvents = async () => {
    let lotteryContract = new window.web3.eth.Contract(
      lotteryABI,
      lotteryAddress
    )
    const records = []
    let events = await lotteryContract.getPastEvents("WIN", {
      fromBlock: 0,
      toBlock: "latest",
    })

    for (let i = 0; i < events.length; i += 1) {
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString()
      record.amount = parseInt(events[i].returnValues.amount, 10).toString()
      records.unshift(record)
    }
    // console.log("Win 기록은?", records)
    setWinRecords(records)
  }

  const getFailEvents = async () => {
    let lotteryContract = new window.web3.eth.Contract(
      lotteryABI,
      lotteryAddress
    )
    const records = []
    let events = await lotteryContract.getPastEvents("FAIL", {
      fromBlock: 0,
      toBlock: "latest",
    })

    for (let i = 0; i < events.length; i += 1) {
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString()
      record.answer = events[i].returnValues.answer
      records.unshift(record)
    }
    console.log("Fail 기록은?", records)
    setFailRecords(records)
  }

  const bet = async () => {
    let lotteryContract = new window.web3.eth.Contract(
      lotteryABI,
      lotteryAddress
    )
    let accounts = await window.web3.eth.getAccounts()
    let account = accounts[0]
    let challenge =
      "0x" + challenges[0].toLowerCase() + challenges[1].toLowerCase()
    let nonce = await window.web3.eth.getTransactionCount(account)
    lotteryContract.methods
      .betAndDistribute(challenge)
      .send({
        from: account,
        value: 5000000000000000,
        gas: 300000,
        nonce: nonce,
      })
      .on("transactionHash", hash => {
        console.log(hash)
      })
  }

  const onClickCard = _Character => {
    setChallenges([challenges[1], _Character])
  }

  const getCard = (_Character, _cardStyle) => {
    return (
      <button
        className={_cardStyle}
        onClick={() => {
          onClickCard(_Character)
        }}
      >
        <div className="card-body text-center">
          <p className="card-text"></p>
          <p className="card-text text-center" style={{ fontSize: 300 }}>
            {_Character}
          </p>
          <p className="card-text"></p>
        </div>
      </button>
    )
  }

  return (
    <div className="App">
      <div className="container">
        <div className="jumbotron">
          <h1>Current Pot:{pot}</h1>
          <p>Lottery tutorial</p>
          <p>Your Bet</p>
          <p>
            {challenges[0]}
            {challenges[1]}
          </p>
        </div>
      </div>
      <div className="container">
        <div className="card-group">
          {getCard("A", "card bg-primary")}
          {getCard("B", "card bg-warning")}
          {getCard("C", "card bg-danger")}
          {getCard("0", "card bg-success")}
        </div>
      </div>
      <br></br>
      <div className="container">
        <button className="btn btn-danger btn-lg" onClick={bet}>
          BET!
        </button>
      </div>
      <br></br>
      <div className="container">
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Index</th>
              <th>Address</th>
              <th>Challenges</th>
              <th>Answer</th>
              <th>Pot</th>
              <th>Status</th>
              <th>AnserBlockNumber</th>
            </tr>
          </thead>
          <tbody>
            {finalRecord.map((record, index) => {
              return (
                <tr key={index}>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
