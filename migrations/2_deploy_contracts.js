const PixelStorage = artifacts.require("PixelStorage.sol");

module.exports = function (deployer) {

  deployer.deploy(PixelStorage).then(function () {
    return PixelStorage.deployed();
  });

};

