import React, { Component, Fragment } from "react";
import SimpleStore from "./SimpleStore";
import LemonadeStand from "./LemonadeStand";
import { getWeb3, getAccounts } from "./utils/getWeb3";

class App extends Component {
  state = {
    web3: null,
    accounts: null
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await getAccounts(web3);
      this.setState({ web3, accounts });
    } catch (error) {
      alert(`Failed to load web3 or accounts. Check console for details.`);
      console.error(error);
    }
  };

  render() {
    const { web3, accounts } = this.state;
    if (!web3 || !accounts) return <div>Loading Web3 And Accounts ...</div>;
    return (
      <Fragment>
        <SimpleStore web3={web3} accounts={accounts} />
        <LemonadeStand web3={web3} accounts={accounts} />
      </Fragment>
    );
  }
}

export default App;
