const Orders = artifacts.require("Orders");
const MockedOrders = artifacts.require("MockedOrders");

module.exports = function (deployer) {
  deployer.deploy(Orders);
  deployer.deploy(MockedOrders);
};
