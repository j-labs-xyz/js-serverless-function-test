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
    "https://serrano.litgateway.com:7378": {
        "sig": "36aa6bfeca823a0a34af852065d34f6317c3e648bccde285a6be26a7f9c246dc28c870f9fa286225ddb24cdc8c99be25e559b19b00eaf75091904e3c0418840d",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7378\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7373": {
        "sig": "ec2b9d37a198e1eef4ca2f9dd3dfa2253365644ba5160a88ba7253bd646f4ddf144bbff55d9080b098ba3fc7448b10d919342d5d3bfef3b9106f4396419ae305",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7373\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7377": {
        "sig": "0d37bcddd3f4b24624ecf5067f368ff8abd417745fb45c94df26585375fe5a277b11d1d48b574107daf42387e73eab88a8c3bf55082917f8211ff78b1256cc04",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7377\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7371": {
        "sig": "02554b8ef0b1171bd8c33aa6b942d0f595c60e6cf9cc90914568564ffd0ad7f56d4e9e8426be4479288166a52e2c71f154511fe94cd070168a10c94546e45102",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7371\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7370": {
        "sig": "dc82ea02170e51f9b2166519fcf6b6cf2c57e9e793063a2fdecdb14ac0fc85c8f565c555e032f52f0f82a5fa3ae553746fa6b47ea7c755363ff1b436e0387006",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7370\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7372": {
        "sig": "f2461e7c1da0f3c2675ba9055723261f5ec2badce8a57c942e662b35b19af85dfc85c4e2b22638cc9765a666a49ad9936410d7d835e124230e208a0700e22400",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7372\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7376": {
        "sig": "6456c34d624bc0ec9a7cdd0f33baa080c2ae59415a05bc31ef6c3828e9c2717ba1559369fe1a0c3b4d3ab44c32567de17032a4944a8f03429821098347933105",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7376\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7375": {
        "sig": "e6db1de060bb39f7be51e8d9f600d7ab7717c408be602f0d700f23c16c0ed442e6ecad8b3b3eb59c9b69320972067a81a2eed16ff58825bc299d5ab353531902",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7375\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7379": {
        "sig": "2831828879272f11b4b191276c7d580f262a64de2eb2fc95dee5d9c9b25f37b5419e1a25916aea435a5bb6284f6acc0439a30df5ac6f268b94f2d94494b22708",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7379\"}",
        "address": "6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676",
        "algo": "ed25519"
    },
    "https://serrano.litgateway.com:7374": {
        "sig": "62a1875a9baf885d60f62657eb337ae244a418da2e708cbb7a128391babb0d7d5190a9decf5cbbb46f82d9e7faf008bff7a1563510ff293f3c95999aba81b006",
        "derivedVia": "litSessionSignViaNacl",
        "signedMessage": "{\"sessionKey\":\"6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\",\"resourceAbilityRequests\":[{\"resource\":{\"resource\":\"*\",\"resourcePrefix\":\"lit-accesscontrolcondition\"},\"ability\":\"pkp-signing\"}],\"capabilities\":[{\"sig\":\"0x2ba38d8535c4231b076c0cf6e5c056387e7c7be8634fecb5156163e5da8f18e11621449ed80619141159c185b6758aeec5b0b9d62c1c101a8fa9898f51079fc01c\",\"derivedVia\":\"web3.eth.personal.sign via Lit PKP\",\"signedMessage\":\"localhost:3000 wants you to sign in with your Ethereum account:\\n0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\\n\\nLit Protocol PKP session signature\\n\\nURI: lit:session:6894e83415d38630cef8805fedecfd672999659871c14bf6c9aed52560113676\\nVersion: 1\\nChain ID: 1\\nNonce: 3eBZxgUCPWK0xGYJS\\nIssued At: 2023-06-21T01:40:16.434Z\\nExpiration Time: 2023-06-22T01:40:16.240Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ\",\"address\":\"0xd0Da8a3Ea847339758Ff628c97cceb6700DDa012\"}],\"issuedAt\":\"2023-06-21T01:40:20.180Z\",\"expiration\":\"2023-06-21T01:45:20.180Z\",\"nodeAddress\":\"https://serrano.litgateway.com:7374\"}",
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
