const AToken = artifacts.require("AToken");
const BToken = artifacts.require("Btoken");
const Swap = artifacts.require("Swap");

module.exports = async function (deployer, network, accounts) {

  // deploy AToken
  await deployer.deploy(AToken);
  const atoken = await AToken.deployed()

  // deploy BToken
  await deployer.deploy(BToken);
  const btoken = await BToken.deployed()

  // deploy Swap
  await deployer.deploy(Swap, atoken.address, btoken.address);
  const swap = await Swap.deployed()

  //transfer 1000 Atoken to investor
  await atoken.transfer(accounts[1], '1000000000000000000000')

  //transfer 1000 Btoken to investor
  await btoken.transfer(accounts[1], '1000000000000000000000')


};
