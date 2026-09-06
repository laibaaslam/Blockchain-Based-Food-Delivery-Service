var ShoppingCart = artifacts.require("ShoppingCart");
var FoodItems = artifacts.require("FoodItems");
var ServiceRating = artifacts.require("ServiceRating");
module.exports = function (deployer, network, accounts) {
  // const sellerAddress = accounts[0]; // Replace with the actual seller's address
  // const transitAccountAddress = accounts[1]; // Replace with the actual transit account's address

  // deployer.deploy(ShoppingCart, sellerAddress, transitAccountAddress);
  deployer.deploy(ShoppingCart);
  deployer.deploy(FoodItems);
  deployer.deploy(ServiceRating);
};
