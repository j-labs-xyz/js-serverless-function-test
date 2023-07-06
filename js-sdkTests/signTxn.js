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

  const sessionSigs = {
    "https://serrano.litgateway.com:7370": {
      "sig": "f983caffa7be71132014842339b39bd46c0637dd266979a6adcab3bfbc0d119a386f7b7abd89044c856f5cf16ab4b533f3618e5bccfa23884590060898d8ac08",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7370\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7374": {
      "sig": "a0a64bb8bb8f4d0acc9369f143a6d18c3d6b675ad2cde0f41db11eac554af05564b2fedbc8a134ab4cec6a00b5460afd25ea6f98a0abd564c1f05dcfdf17f204",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7374\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7371": {
      "sig": "d352147ca9f143b8e3653b159d9f1c73e8c946d0dc751ac7313e5cf6f025afb614f7add84307b3ec1b652bb0df7ccdf9742406e62829f2a00110f27415961803",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7371\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7373": {
      "sig": "271e8a6dec56a8d47f7afaa19e2b9db3de0574f72019fc9118039c101a413befe5609a0dc955325947cb9e2db0ca057b18fa1f819cf9676f8794bb0dcb8d4706",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7373\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7375": {
      "sig": "70ac398f71a8e4b1ffe0e44d40176cb11e7dc0f68a59fae409a51f4006009fa86ea869f4e52a2e908cac23ebeab80ac883521bb4b2fdcd6fe81bece9e0d2150f",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7375\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7372": {
      "sig": "8edd7b27691cc333452ad90bee9f37f515f7210adc0d7ed2b05a0fb3237a1b3a33a445bf689fd8b4760929db2f12dff8a7f754f2b4cb29c3c305b3a1284d5f00",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7372\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7376": {
      "sig": "6d14559ba3caf7907d9bd3dc873335525b8f5dd03499f2874247e94947e3070a5e45d4ab87f684f8b2a5a4d1542563443fe544d1e7df66ed6210d5686c075d0d",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7376\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7378": {
      "sig": "804088215af9caeab814a5f8530dd1bbf52758f447bda18542b28d03bd8b3f92af9391a2d6fb4e27becf63dd1e9b4598bff0b891dee66b6e00bb6c0d97860202",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7378\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7377": {
      "sig": "d86f62690c289d00b15fd0639ccbe6696163404e0ab17211e4475531036abb31ad64ddb90bcc15ac5b5ad2e5ce47e2f2058ab3efdfaf6f9a7aaac36ae3856f0b",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7377\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7379": {
      "sig": "410dd15499d6a24b85b9fbc84005a45c01876586015d626d47b6aec1c528a0d5dc5ed7291e2c45bdc4d6c2c3175b3119bcc9cca174d8ff2aeeaa84e81cd75b0d",
      "derivedVia": "litSessionSignViaNacl",
      "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x71f5512f4850732b01ea1adefc82a87b3acd11094752c9b135bf3b513b8358e557197dc11c59db4f805e0f260ef3ebad10fa48321973b5abdc7cbd0333839d941c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xA9f46debD103DAD171FB0491635b840C382a5753\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: lzl6oAU2mpUR65TIt\\nIssued At: 2023-07-06T13:06:47.799Z\\nExpiration Time: 2023-07-07T13:06:47.633Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xA9f46debD103DAD171FB0491635b840C382a5753\"}],\"issuedAt\":\"2023-07-06T13:06:53.187Z\",\"expiration\":\"2023-07-06T13:11:53.187Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7379\"}",
      "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
      "algo": "ed25519"
    }
  };

  const results = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs: sessionSigs,
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
