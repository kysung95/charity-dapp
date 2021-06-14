import { useEffect, useState } from "react"
import NavigationBar from "./components/navigation/NavigationBar"
import Banner from "./components/banner/Banner"
import Layout from "./components/layout/Layout"
import MessageListContainer from "./components/messages/MessageListContainer"
import "./App.css"
import Web3 from "web3"

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

      <Banner />
      <div className="main">
        <div className="squeeze">
          <div className="sub-container-flex"></div>
          <div className="message-section-title">기부해주신 분들</div>
          <div className="message-flex">
            <MessageListContainer />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
