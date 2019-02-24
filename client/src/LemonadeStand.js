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
  const [error, errorSet] = useState(null);
  //  const [forSale, forSaleSet] = useState([]);

  const runExample = async () => {
    try {
      errorSet("Error Lemonade Stand Contract loading failed!");
      const c = await getContract(props.web3, LemonadeStandContract);
      contractSet(c);
      errorSet("Error Lemonade Stand Contract access failed!");
      await c.methods.owner().call(); // test contract access
      errorSet(null);
      c.events.allEvents((e, r) => {
        if (e) {
          console.error(e);
          return alert("AllEvents event failed. Check console for details.");
        }
        if (r) console.log(r.event, r);
      });
      /*
      c.events.Sold((e, r) => {
        if (e) {
          console.error(e);
          return alert("Sold event failed. Check console for details.");
        }
        if (r) console.log("Sold event", r);
      });
      c.getPastEvents("ForSale", (e, r) => {
        if (e) return;
        console.log(r);
        r.map(i =>
          c.methods
            .fetchItem(i.returnValues.skuCount)
            .call()
            .then(item => console.log(item) || forSaleSet([...forSale, item]))
        );
      });
      */
    } catch (e) {
      console.error(e);
    }
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
      })
      .catch(e => alert("Item fetch failed. Check console for details."));
  };
  const buyItem = (sk, prce) => {
    contract.methods
      .buyItem(sk)
      .send({ from: props.accounts[0], value: prce })
      .then(r => console.log(r))
      .catch(e => {
        alert("Buy Item Failed. Check console for details.");
        console.log(e);
      });
  };
  const shipItem = sk => {
    contract.methods
      .shipItem(sk)
      .call()
      .then(r => console.log(r))
      .catch(e => {
        alert("Ship Item Failed. Check console for details.");
        console.log(e);
      });
  };
  if (!contract) return <div>Loading contract ...</div>;
  if (error)
    return <div>{error}. Incorrect network or not deployed contract.</div>;
  return (
    <div className="App">
      <h1>Lemonade Stand</h1>
      <input type="submit" value="Sell Item" onClick={sellItem} />
      <label>Name:</label>
      <input type="text" onChange={e => nameSet(e.target.value)} />
      <label>Sale Price:</label>
      <input type="text" onChange={e => priceSet(e.target.value)} /> <br />
      <input type="submit" value="Fetch Item" onClick={fetchItem} />
      <input
        type="submit"
        value="Buy Item"
        onClick={() => buyItem(sku, pricePurchase)}
      />
      <input type="submit" value="Ship Item" onClick={() => shipItem(sku)} />{" "}
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
      {/*(() => {
        if (forSale && forSale.length <= 0) return <div>No items for sale</div>;
        return (
          <div>
            <h3>Item For Sale</h3>
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
                {forSale.map(item => (
                  <tr key={item.sku}>
                    <th>{item.name}</th>
                    <th>{item.price}</th>
                    <th>
                      <input
                        type="submit"
                        value="Buy"
                        onClick={() => buyItem(item.sku, item.price)}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()*/}
    </div>
  );
}

export default LemonadeStand;
