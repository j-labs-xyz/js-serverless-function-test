import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import { splitSignature, joinSignature, arrayify } from "@ethersproject/bytes";
import { Wallet, verifyMessage } from "@ethersproject/wallet";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
import { ethers } from "ethers";
import * as siwe from "siwe";
import * as fs from 'fs';

// this code will be run on the node
let litActionCode = fs.readFileSync("./build/signTxnTest.js");
litActionCode = litActionCode.toString("ascii");

// this code will be run on the node
const go = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    debug: true,
    litNetwork: "serrano",
  });
  await litNodeClient.connect();

  // you need an AuthSig to auth with the nodes
  // normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
  // NOTE: to replace with a new one that you get from oauth-pkp-signup-example
  // const authSig = await generateAuthsig(
  //   "localhost",
  //   "http://localhost:3000",
  //   "175177" // chronicle chain id
  // );

  const authSig = {
    "sig": "0xc32039c053f9055c3deaa028f9e9871461b3013f8bee09f014a0a7cc3d0d17940e159321b385a8722d1fd53b376eb8fc10339181b0438d6ca7bc939890e4b5821c",
    "derivedVia": "web3.eth.personal.sign via Lit PKP",
    "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:\n0x239e847590EB7F553487F2bC45160a73F3532d30\n\nLit Protocol PKP session signature I further authorize the stated URI to perform the following actions on my behalf: (1) '*': '*' for 'lit-accesscontrolcondition://00d1e180cfa487da9cdfca819d4619a3dea499c71aabc2a08518782d02c7d30d'.\n\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\nVersion: 1\nChain ID: 1\nNonce: skYaOVzB3uVj3AU0m\nIssued At: 2023-06-15T02:21:48.747Z\nExpiration Time: 2023-06-16T02:21:48.578Z\nResources:\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8wMGQxZTE4MGNmYTQ4N2RhOWNkZmNhODE5ZDQ2MTlhM2RlYTQ5OWM3MWFhYmMyYTA4NTE4NzgyZDAyYzdkMzBkIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ",
    "address": "0x239e847590EB7F553487F2bC45160a73F3532d30"
  };

  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {},
  });
  
  console.log("results", results);
  const { signatures, response } = results;
  console.log("response", response);
  const sig = signatures.sig1;
  const { dataSigned } = sig;
  const encodedSig = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });

  const { txParams } = response;

  console.log("encodedSig", encodedSig);
  console.log("sig length in bytes: ", encodedSig.substring(2).length / 2);
  console.log("dataSigned", dataSigned);
  let dataSginedBytes = arrayify("0x" + dataSigned);
  const splitSig = splitSignature(encodedSig);
  console.log("splitSig", splitSig);

  const recoveredPubkey = recoverPublicKey(dataSginedBytes, encodedSig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);

  const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
  console.log("compressed recoveredPubkey", compressedRecoveredPubkey);
  const recoveredAddress = recoverAddress(dataSginedBytes, encodedSig);
  console.log("recoveredAddress", recoveredAddress);

  const txn = serialize(txParams, encodedSig);

  console.log("txn", txn);

  // broadcast txn
  const provider = new ethers.providers.JsonRpcProvider(
    // process.env.LIT_MUMBAI_RPC_URL
    "https://rpc.ankr.com/polygon_mumbai"
  );
  const result = await provider.sendTransaction(txn);
  console.log("broadcast txn result:", JSON.stringify(result, null, 4));
};

export async function generateAuthsig(domain, origin, chainId) {
  const privKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const wallet = new Wallet(privKey);

  const statement = "";

  const expiration = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();
  const siweMessage = new siwe.SiweMessage({
    domain,
    address: wallet.address,
    statement,
    uri: origin,
    version: "1",
    chainId: chainId,
    expirationTime: expiration,
  });

  const messageToSign = siweMessage.prepareMessage();

  const signature = await wallet.signMessage(messageToSign);

  const recoveredAddress = verifyMessage(messageToSign, signature);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: messageToSign,
    address: recoveredAddress,
  };

  return authSig;
}

go();
