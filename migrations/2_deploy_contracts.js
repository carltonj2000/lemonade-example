var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var LemonadeStand = artifacts.require("./LemonadeStand.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(LemonadeStand);
};
