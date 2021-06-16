import React, { Component } from "react"
import DonateForm from "../form/DonateForm"
import bannerImage from "../../images/seoga-charity.png"
import charity from "../../ethereum/factory"
import web3 from "../../ethereum/web3"
import "./Banner.css"
import "../../App.css"

export default class Banner extends Component {
  state = {
    modalOpen: false,
    balance: "",
    donatorsCount: "",
    charityCount: 0,
  }

  componentDidMount = async event => {
    const summary = await charity.methods.getSummary().call() // charity 진행 현황을 나타내어주는 객체

    this.setState({
      balance: summary[0], // 쌓인 기부 금액
      donatorsCount: summary[1],
      charityCount: summary[2], //기부인원
    })
  }

  // initWeb3 = async () => {
  //   if (window.ethereum) {
  //     console.log("Recent mode")
  //     this.web3 = new Web3(window.ethereum)
  //     try {
  //       // Request account access if needed
  //       await window.ethereum.enable()
  //       // Acccounts now exposed
  //       // this.web3.eth.sendTransaction({/* ... */});
  //     } catch (error) {
  //       // User denied account access...
  //       console.log(`User denied account access error : ${error}`)
  //     }
  //   }
  //   // Legacy dapp browsers...
  //   else if (window.web3) {
  //     console.log("legacy mode")
  //     this.web3 = new Web3(Web3.currentProvider)
  //     // Acccounts always exposed
  //     // web3.eth.sendTransaction({/* ... */});
  //   }
  //   // Non-dapp browsers...
  //   else {
  //     console.log(
  //       "Non-Ethereum browser detected. You should consider trying MetaMask!"
  //     )
  //   }

  //   let accounts = await this.web3.eth.getAccounts()
  //   this.account = accounts[0]

  //   this.charityContract = new this.web3.eth.Contract(
  //     charityABI,
  //     charityAddress
  //   )
  //   console.log(this.charityContract)
  // }

  clickOpenModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    })
  }

  render() {
    // const { balance, donatorsCount, charityCount  } = this.props //원래 props로 넘겨주려했으나, component 내부에서 처리함
    return (
      <div>
        <div className="banner-background">
          <DonateForm
            clickOpen={this.state.modalOpen}
            onClose={this.clickOpenModal}
          />
          <div className="main-banner">
            <div className="squeeze">
              <div className="banner-flex">
                <div className="column__one-third">
                  <div className="banner-header">
                    서가는 <br /> "나를 위한 글쓰기" <br /> 모임입니다.
                  </div>
                  <div className="banner-caption__description-amount">
                    기부해주시는 금액은 심리 치유가 필요한 사람들에게
                    전달됩니다.
                    <br /> 지금까지 <strong>{this.state.charityCount}</strong>
                    분이 참가해주셨습니다.
                    <div className="banner-caption-ether">
                      {" "}
                      {web3.utils.fromWei(this.state.balance, "ether")}
                      <span>ETH</span>
                    </div>
                  </div>
                  <button
                    className="donate-button__banner"
                    onClick={() => this.clickOpenModal()}
                  >
                    기부하기
                  </button>
                </div>
                <div className="column__two-third">
                  <img
                    className="iphonex-asset"
                    src={bannerImage}
                    alt="bannerImage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
