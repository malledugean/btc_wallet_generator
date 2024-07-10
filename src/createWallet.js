// dependency import
const bip39 = require("bip39");
const bip32 = require("bip32");
const libbtc = require("bitcoinjs-lib");
const fs = require("node:fs/promises");

// Save data to a File
async function saveFile(fileName = "wallet", fileContent = "Your Content") {
    try {
        const content = fileContent;
        await fs.writeFile(fileName, content);
        console.log("File saved!");
    } catch (err) {
        console.log(err);
    }
}

// Generate a Wallet
function generateWallet() {
    // set network
    // const network = libbtc.networks.testnet;
    const network = libbtc.networks.bitcoin;

    // derivation path
    const deriv_path = `m/49'/1'/0'/0`;

    //create a mnemonic for a seed
    let mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    //define the root for the wallet
    let walletRoot = bip32.fromSeed(seed, network);

    // create an account - pair pvt-pub keys
    let account = walletRoot.derivePath(deriv_path);
    let node = account.derive(0).derive(0);

    let btcAddress = libbtc.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    }).address;

    myAddress = "Address: " + btcAddress;
    myPK = "Private Key:" + node.toWIF();
    mySeed = "Seed:" + mnemonic;
    fileName = btcAddress + ".txt";

    console.log("Address: ", btcAddress);
    console.log("Private Key:", node.toWIF());
    console.log("Seed:", mnemonic);
    console.log("Wallet generated");

    // Save wallet data
    saveFile(
        fileName,
        fileName + "\n" + myAddress + "\n" + myPK + "\n" + mySeed
    );
}

// main
generateWallet();
