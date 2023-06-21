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
    "https://serrano.litgateway.com:7372": {
        "sig": "364095db8f5ff660bc290f70b745f42cee679953320358e40b2f840dc85ea31a6cb3a4339bf755a04f007030d72ca0df9bcb2c05681a3786753cf331a3c0870b",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7372\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7371": {
        "sig": "1ff2a305a4e9bf13098df87701a7d32f9cc123dd9bf3a93bbfe544ca7b3205c419716950a7bccff440aec2575a48e795e2d5afffeccfdab9e65ac94ce81a4b0c",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7371\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7374": {
        "sig": "1afa8032c07e4529d4316b32690c89d2658464919699c7c469ad79358917af1189f46abc27cf5dee4a0577d817a0fc4f5bd3966e2acf76f43804dfe07670d40d",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7374\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7379": {
        "sig": "978a5cc844a84db1e1606bb5bc8cd4841d3f08b9a81904f42c4929e40c605f94b24daf72636907dd227e899c7e33b8583ee05a84446b4ff00eb6af1dde780608",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7379\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7370": {
        "sig": "c0425c0370d0a2b549f5143eb2b39528cf4374f7b55948656a33239dbf6acd2e6860a24b28378fa1ef6d92ca6df93109673004ffe92147f117afc64c0a49a30c",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7370\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7373": {
        "sig": "1e381bf2db140823144e1d819ef5c4b4712e58f71cc8affaee87cae99368eb802902a235eb507270c3069b93da5f73fae3bd372086b573b029d07d49613cea0d",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7373\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7375": {
        "sig": "89a4a4b40ccecff777dc864f47b10f3a9c0ebfcb753ed747cf8fc256da9150aa876b22880ed2126ec39f7e6927c0076b8ab157b1be5c7cbc71236c8e7178a102",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7375\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7376": {
        "sig": "9f1a8e01615ca4eb8cab64cbc2ce2e17460f32a22298db7f39aab73bdc619247a81b2ccd01df86f28e30791d8aae6465026ab69e52581fc6318b804e4f47f202",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7376\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7378": {
        "sig": "660b2d96c2fcdf28466e2d8c28d7e546d71bda2ca3be4c957f97d0d4c42b0a83da773ec52a0409c345e3febbbe4fb49012a9075ae02183e66bc564bf834aa006",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7378\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7377": {
        "sig": "6f0faafb0404b76fd32045fd6e37f638502cf25781e16e911ec97d84a3c2bafb7f76190ecf73d4fadd6c777c82722edb8c64312d4a0e6ab2d61a13dcd6a89805",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0xcced22770bc8115b21dc433bfdc37ac13b5a70ad1190422ff3c3ab50fe44b0f96a6505e0dcb6cb46b5b262ec58b265ef7126978a55a6b3eca3e0c76cab6d569d1b\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xE13efDd563084CF33484C98f98B7A446913050d4\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 1U5ixRMhR5BslvFsl\\nIssued At: 2023-06-21T06:04:40.006Z\\nExpiration Time: 2023-06-22T06:04:39.778Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xE13efDd563084CF33484C98f98B7A446913050d4\"}],\"issuedAt\":\"2023-06-21T06:04:43.991Z\",\"expiration\":\"2023-06-21T06:09:43.991Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7377\"}",
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
