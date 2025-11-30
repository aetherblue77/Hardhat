import { channel } from "diagnostics_channel";
import { ethers } from "ethers";
import fs from "fs";

async function main() {
  // compile them in our code
  // compile them separately
  // http://127.0.0.1:8545
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  // Get nonce Before
  const nonceBefore = await provider.getTransactionCount(wallet.address);
  console.log("Current Nonce Before:", nonceBefore);

  // Read Abi & Binary
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = "0x" + fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  ).trim();

  // Gas Price
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  console.log("Gas Price:", gasPrice.toString());

  // Gas Limit Estimation
  const gasLimit = await provider.estimateGas({
    data: binary,
  })

  // Chain ID
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  console.log("Chain ID:", chainId);


  // Contract Factory & Deploy
  // const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  // console.log("Deploying, please wait...");
  // const contract = await contractFactory.deploy();

  // // Tunggu Deployment Selesai (Sudah live di Blockchain)
  // await contract.waitForDeployment();

  // // Ambil TX deploymentnya
  // const deploymentTx = contract.deploymentTransaction();
  // const receipt = await deploymentTx.wait(1);

  // Build Raw Transaction
  const tx = {
    nonce: nonceBefore,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    to: null, // null = DEPLOY CONTRACT
    value: 0,
    data: binary,
    chainId: chainId,
  }


  console.log("TX object:", tx);


  // Sign Transaction
  const signedTx = await wallet.signTransaction(tx);
  console.log("Signed TX:", signedTx);

  //Send Raw Transaction
  const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);
  console.log("Tx hash:", txHash);


  // WAIT FOR MINING
  const receipt = await provider.waitForTransaction(txHash);

  // Berapa transaction yang sudah terjadi SEBELUM Transaction
  const nonceAfter = await provider.getTransactionCount(wallet.address, "pending");

  // OUTPUT
  console.log("Block Number:", receipt.blockNumber);
  console.log("Status:", receipt.status);
  console.log("Contract deployed at:", await receipt.contractAddress);
  console.log("Gas Used:", receipt.gasUsed.toString());
  // console.log("Transaction Hash:", receipt.hash);
  console.log("Current nonce Now:", nonceAfter);

  // Send transaction with Data

  // const signedTxResponse = await wallet.signTransaction(tx);
  // console.log(signedTxResponse);
}

main().catch((error) => console.error(error));


