import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { getContract } from "./utils/getWeb3";

function SimpleStore(props) {
  const [newValue, newValueSet] = useState(0);
  const [storageValue, storageValueSet] = useState(0);
  const [contract, contractSet] = useState(null);
  const [error, errorSet] = useState(null);

  const runExample = async () => {
    try {
      errorSet("Error Simple Storage Contract loading failed!");
      const c = await getContract(props.web3, SimpleStorageContract);
      contractSet(c);
      errorSet("Error Simple Storage Contract access failed!");
      const storeVal = await c.methods.get().call();
      errorSet(null);
      storageValueSet(storeVal);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runExample();
  }, [props.web3, props.accounts]);

  if (!contract) return <div>Loading contract ...</div>;
  if (error)
    return <div>{error}. Incorrect network or not deployed contract.</div>;
  return (
    <div className="App">
      <h1>Simple Storage</h1>
      <label>Store Value:</label>
      <input
        type="text"
        onChange={e => newValueSet(parseInt(e.target.value))}
      />
      <input
        type="submit"
        value="submit"
        onClick={() =>
          contract.methods.set(newValue).send({ from: props.accounts[0] })
        }
      />
      <div>The stored value is: {storageValue}</div>
    </div>
  );
}

export default SimpleStore;
