import web3 from "./web3"
import CharityCampaign from "./build/Charity.json"

//pre-configured instance for our contract
const instance = new web3.eth.Contract(
  JSON.parse(CharityCampaign.interface),
  "0xC89C4883D9206f011cC10AeB06558845BCe8Ddfd"  //contract 주소
)

export default instance
