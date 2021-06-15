import web3 from "./web3"
import CharityCampaign from "./build/Charity.json"

//pre-configured instance for our contract
const instance = new web3.eth.Contract(
  JSON.parse(CharityCampaign.interface),
  "0x507af33c5627A45805C5311b77B2794f405851D8"
)

export default instance
