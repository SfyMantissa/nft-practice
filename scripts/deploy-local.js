const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('NFTPractice');
  const gameContract = await gameContractFactory.deploy(
    ["Ryuuko", "Jotaro", "Pikachu"],
    ["QmVDMo7DXu2oqMoSwEt51SKcDEmzaKSuHB9sHF7tSizu9K",
      "QmV2PdKwzxzqD6DzsyWeG1FrMgKP9AaqMq48QTWxsRigJF",
      "QmbtLVBRAt7rLHvP6Gvd7MAReSepkkVazVL2FcJjcXPfdm"],
    [500, 700, 1000],
    [200, 150, 125],
    "Darth Vader",
    "QmVCjxYs4Qgqn5hbbrCQDgXWew43nZYCHuBzojihWLD7zH",
    10000,
    75,
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  console.log("Done");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
