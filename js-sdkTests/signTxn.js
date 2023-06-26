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
    "https://serrano.litgateway.com:7377": {
        "sig": "1c6231afb30ddc1d016afdf5a031de04531fe80656e2a0936c39b72d40dad1015e165d593888e2376d6f5212723ac4370315eccb1fe3aea918bbd657fd1a0b04",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7377\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7371": {
        "sig": "3d51631d25eb63c15fdc178474fe964aa9e09557fcf3e54c09fdae5ac543e370f5f86f8675e76b76e84b0d773ee210487d7a8e66445aca896e6437dcc095e501",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7371\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7379": {
        "sig": "bb075a1cd83aa0c2941a0330e26168bf89dcc798ac0db732665afe14d48046f64dfa6127e93c999af18029e4fe825176b1f5bc5a5a0ae45ed7cd8067e9b20f00",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7379\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7376": {
        "sig": "1d60b10a5b8abd52e90aab8bc56c367bf7840cb8daa37e33a2c466f73ec6e87758b1ce90d1b6757afab221dcb1ebfddb161a3c465304063bb1580e876675f40b",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7376\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7373": {
        "sig": "c1bea844cf9733237da9ddc9f0ccd5a428ac0a9fbc43a3ef89705d71fbc14a476680c4fb898240bdeafe27d38d264e1a9b62bd846782216f6e9326fe83313809",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7373\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7378": {
        "sig": "71c1aa30e9f7757c8537d771dbcfeff4e2d4166334497517f65abd7c489838e067514016e9403f4029cd3cad8c8b14e0f766313a6215bf9e6a96c5fae00d570d",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7378\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7372": {
        "sig": "fd08030057d861083cb41d7fc7cb73b16daac06f2ddb1dfbf4ce45c3c478ccefa5c7076244bc4c3f50b55b36ef74a2d4b06c9335a0574ca65b086957d3f67a03",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7372\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7374": {
        "sig": "ffe30c1b7fd352ce2744fb2e02b15deabf19fc6f4af578b2790e9de45d284a10340140520aceef544b5b7c85de787a9e8a43652daac9eed37d03375dbfa1b303",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7374\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7375": {
        "sig": "c3d46289350cd13072d872240c59e2003fded257ae8c40fed3af67eecd051a5d0cec124a7476fd25dad80c5158f222ce8aaf38a5ecea52a11069d771f16ddf06",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7375\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7370": {
        "sig": "1996ca413051a2b59e7b9622c2ac49075fa744ee00f4f4f24ba4672b682765533fec14c2728312faa3bb0add58a24988af10eb39b8dc366f3f76d72ce3b2d00d",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x0f2b33354ee381ed532f0c0c0b18272b461d680c0f49be89584727f6736870b877f3a120ba21acc71cb6d31927747aea2f6354950a22928b26752462bb8b68461b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: C5cuHzVFtBRmjGQCl\\nIssued At: 2023-06-26T15:47:19.196Z\\nExpiration Time: 2023-06-27T15:47:19.036Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841\"}],\"issuedAt\":\"2023-06-26T15:47:23.110Z\",\"expiration\":\"2023-06-26T15:52:23.110Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7370\"}",
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
