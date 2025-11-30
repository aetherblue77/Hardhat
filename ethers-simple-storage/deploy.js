import { channel } from "diagnostics_channel";
import { ethers } from "ethers";
import fs from "fs-extra";
import "dotenv/config";
import { Wallet } from "ethers";

async function main() {
    // compile them in our code
    // compile them separately
    // http://127.0.0.1:8545
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    // let wallet = await Wallet.fromEncryptedJson(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD,
    // );
    // wallet = await wallet.connect(provider);

    // Read Abi & Binary
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf8",
    );
    const binary =
        "0x" +
        fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8").trim();

    // Contract Factory & Deploy
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy();

    // Tunggu Deployment Selesai (Sudah live di Blockchain)
    await contract.waitForDeployment();
    console.log("Contract Address:", contract.target);

    // Ambil TX deploymentnya
    // const deploymentTx = contract.deploymentTransaction();
    // const receipt = await deploymentTx.wait(1);

    // Get Number
    const currentFavoriteNumber = await contract.retrieve();
    console.log("Current Favorite Number:", currentFavoriteNumber.toString());

    await new Promise((resolve) => setTimeout(resolve, 200));

    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updateFavoriteNumber = await contract.retrieve();
    console.log("Update Favorite Number:", updateFavoriteNumber.toString());
}

main().catch((error) => console.error(error));
