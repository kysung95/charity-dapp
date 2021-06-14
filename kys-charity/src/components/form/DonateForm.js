import React, { Component } from "react"
import charity from "../../ethereum/factory"
import web3 from "../../ethereum/web3"
import "./DonateForm.css"
import PeriodLoader from "../common/PeriodLoader"

export default class DonateForm extends Component {
  state = {
    name: "",
    description: "",
    value: "",
    loading: false,
    errorMessage: "",
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e)
  }

  onDonateMessageSend = async event => {
    event.preventDefault()
    const { description, name, value } = this.state
    if (this.state.value === "" || this.state.value === 0) {
      return this.setState({ errorMessage: "기부하실 금액을 입력해주세요" })
    }
    if (
      this.state.value === "" &&
      this.state.description === "" &&
      this.state.name === ""
    ) {
      return this.setState({ errorMessage: "비어서는 안되는 필드입니다." })
    }
    try {
      const accounts = await web3.eth.getAccounts()
      this.setState({
        loading: true,
        errorMessage: "",
      })
      await charity.methods
        .contributeMessage(description, name, web3.utils.toWei(value, "ether"))
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, "ether"),
        })
    } catch (err) {
      console.log(err.message)
      if (err.message.replace(/ .*/, "") === "while") {
        return this.setState({
          errorMessage: "숫자로만 입력가능합니다.",
          value: "",
          loading: false,
        })
      } else if (err.message.replace(/ .*/, "") === "Returned") {
        return this.setState({
          errorMessage: "기부를 중단하시겠습니까?",
          value: "",
          loading: false,
        })
      }
      if (err.message.replace(/ .*/, "") === "No") {
        return this.setState({
          errorMessage: "메타마스크 정보를 읽어들일 수가 없습니다.",
          value: "",
          loading: false,
        })
      }
    }
    window.location.reload()
    this.setState({ loading: false, value: "", name: "", description: "" })
  }

  render() {
    if (!this.props.clickOpen) {
      return null
    }

    return (
      <div className="modal-background">
        <div className="form-background">
          {this.state.loading === true ? (
            <div className="form-header">지갑정보가 없습니다.</div>
          ) : (
            <div className="form-header">
              기부금액은 <br />
              투명하게 관리됩니다.
            </div>
          )}

          <div
            onClick={e => {
              this.onClose(e)
            }}
            className="modal-close"
          >
            x
          </div>
          <div
            className={this.state.loading === true ? "loading-form" : "hide"}
          >
            <PeriodLoader />
          </div>
          <div className={this.state.loading === true ? "hide" : "flex-forms"}>
            <div className="form-align"></div>
            {/* <hr className='horizontal-line' /> */}
            <div className="form-caption">이름</div>
            <input
              type={this.state.errorMessage === "Empty fields" ? "text" : ""}
              maxLength="24"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            ></input>
            <div className="form-caption">남기는 메시지</div>
            <input
              type={this.state.errorMessage === "Empty fields" ? "text" : ""}
              maxLength="180"
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            ></input>
            <div className="form-caption">기부금액 (단위:eth)</div>
            <input
              type={this.state.errorMessage ? "text" : ""}
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            ></input>
            <div
              className={this.state.errorMessage ? "error-message" : "empty"}
            >
              {this.state.errorMessage}
            </div>
            <button
              type="button"
              className="donate-button"
              onClick={this.onDonateMessageSend}
            >
              완료
            </button>
          </div>
        </div>
      </div>
    )
  }
}
