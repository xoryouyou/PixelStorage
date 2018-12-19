var Migrations = artifacts.require("./Migrations.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations).then(function () {
    return Migrations.deployed();
  });
};
