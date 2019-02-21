import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { getContract } from "./utils/getWeb3";

function SimpleStore(props) {
  const [newValue, newValueSet] = useState(0);
  const [storageValue, storageValueSet] = useState(0);
  const [contract, contractSet] = useState(null);

  const runExample = async () => {
    const c = await getContract(props.web3, SimpleStorageContract);
    if (!c) return;
    contractSet(c);
    //await contract.methods.set(5).send({ from: accounts[0] });
    const storeVal = await c.methods.get().call();
    storageValueSet(storeVal);
  };

  useEffect(() => {
    runExample();
  }, [props.web3, props.accounts]);

  if (!contract) return <div>Loading contract ...</div>;
  return (
    <div className="App">
      <h1>Simple Storage</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          contract.methods.set(newValue).send({ from: props.accounts[0] });
        }}
      >
        <label>Store Value:</label>
        <input
          type="text"
          onChange={e => newValueSet(parseInt(e.target.value))}
        />
        <input type="submit" value="submit" />
      </form>
      <div>The stored value is: {storageValue}</div>
    </div>
  );
}

export default SimpleStore;
