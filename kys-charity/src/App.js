import { useEffect, useState } from "react"
import NavigationBar from "./components/navigation/NavigationBar"
import Banner from "./components/banner/Banner"
import Layout from "./components/layout/Layout"
import MessageListContainer from "./components/messages/MessageListContainer"
import SubHeader from "./components/subHeader/SubHeader"
import "./App.css"
import Web3 from "web3"

const book = require("./images/book-iso.png")
const park = require("./images/tree-iso.png")
const cannedGood = require("./images/can-iso.png")

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
  }

  return (
    <Layout>
      <NavigationBar />
      {/* <svg id="waves" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 222.73">
    <title>waves</title>
    <path className="cls-1" d="M0,109S315,213,553,213,1191-21,1600,48V258H0Z" transform="translate(0 -35.27)" />
  </svg> */}
      <Banner />
      <div className="main">
        <div className="squeeze">
          <div className="sub-container-flex">
            <SubHeader
              padding="extra-padding"
              title="Food"
              subContent={cannedGood}
              animation="reg"
            />
            <SubHeader title="Education" subContent={book} animation="medium" />
            <SubHeader title="Recreation" subContent={park} animation="slow" />
          </div>
          <div className="message-section-title">Donors</div>
          <div className="message-flex">
            <MessageListContainer />
            {/* <div className='round-circle'></div> */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
