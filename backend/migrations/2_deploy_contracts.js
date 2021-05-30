const Orders = artifacts.require("Orders");
const MockedOrders = artifacts.require("MockedOrders");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Orders);

  if (network == 'development') {
    deployer.deploy(MockedOrders);
  }
};
