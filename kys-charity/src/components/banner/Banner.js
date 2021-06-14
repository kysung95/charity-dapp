import React, { Component } from "react"
import DonateForm from "../form/DonateForm"
import iphoneX from "../../images/seoga-charity.png"
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
    const summary = await charity.methods.getSummary().call()
    this.setState({
      balance: summary[0],
      donatorsCount: summary[1],
      charityCount: summary[2],
    })
    // console.log(summary);
  }

  clickOpenModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    })
  }

  render() {
    // const { balance, donatorsCount, charityCount  } = this.props
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
                  {/*
            <div className='banner-caption'>Join the cause and help others in need</div> */}
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
                  <img className="iphonex-asset" src={iphoneX} alt="iPhoneX" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
