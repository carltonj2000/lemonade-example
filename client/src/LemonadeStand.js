import React, { useState, useEffect } from "react";
import LemonadeStandContract from "./contracts/LemonadeStand.json";
import { getContract } from "./utils/getWeb3";

function LemonadeStand(props) {
  const [contract, contractSet] = useState(null);
  const [name, nameSet] = useState("");
  const [price, priceSet] = useState("");
  const [pricePurchase, pricePurchaseSet] = useState("");
  const [sku, skuSet] = useState("");
  const [skuIn, skuInSet] = useState("");
  const [nameIn, nameInSet] = useState("");
  const [priceIn, priceInSet] = useState("");
  const [availableIn, availableInSet] = useState("");
  //const [subscription, subscriptionSet] = useState(null);

  const runExample = async () => {
    const c = await getContract(props.web3, LemonadeStandContract);
    if (!c) return;
    c.events.ForSale((e, r) => {
      if (e) {
        console.error(e);
        return alert("ForSale event failed. Check console for details.");
      }
      if (r) console.log("ForSale event", r);
    });
    c.events.Sold((e, r) => {
      if (e) {
        console.error(e);
        return alert("Sold event failed. Check console for details.");
      }
      if (r) console.log("Sold event", r);
    });
    contractSet(c);
  };

  useEffect(() => {
    runExample();
  }, [props.web3, props.accounts]);

  const sellItem = () => {
    contract.methods
      .addItem(name, parseInt(price))
      .send({ from: props.accounts[0] });
  };
  const fetchItem = () => {
    contract.methods
      .fetchItem(sku)
      .call()
      .then(item => {
        console.log(item);
        skuInSet(item.sku);
        nameInSet(item.name);
        priceInSet(item.price);
        availableInSet(item.stateIs);
        skuSet("");
      })
      .catch(e => alert("Item fetch failed. Check console for details."));
  };
  const buyItem = () => {
    contract.methods
      .buyItem(sku)
      .send({ from: props.accounts[0], value: pricePurchase })
      .then(r => console.log(r))
      .catch(e => {
        alert("Buy Item Failed. Check console for details.");
        console.log(e);
      });
  };
  if (!contract) return <div>Loading contract ...</div>;
  return (
    <div className="App">
      <h1>Lemonade Stand</h1>
      <input type="submit" value="Sell Item" onClick={sellItem} />
      <label>Name:</label>
      <input type="text" onChange={e => nameSet(e.target.value)} />
      <label>Sale Price:</label>
      <input type="text" onChange={e => priceSet(e.target.value)} /> <br />
      <input type="submit" value="Fetch Item" onClick={fetchItem} />
      <input type="submit" value="Buy Item" onClick={buyItem} />
      <label>SKU:</label>
      <input type="text" onChange={e => skuSet(parseInt(e.target.value))} />
      <label>Purchase Price:</label>
      <input
        type="text"
        onChange={e => pricePurchaseSet(e.target.value)}
      />{" "}
      <br />
      <div>
        Fetched Item: sku: {skuIn}, name: {nameIn}, price: {priceIn}, state:{" "}
        {availableIn}
      </div>
    </div>
  );
}

export default LemonadeStand;
