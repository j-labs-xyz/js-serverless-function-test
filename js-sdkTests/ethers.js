import * as LitJsSdk from "@lit-protocol/lit-node-client";
import fs from "fs";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  const val = ethers.utils.formatEther(10000)
  LitActions.setResponse({response: JSON.stringify({val})})
};

go();
`;

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

const go = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    debug: true,
    litNetwork: "custom",
    bootstrapUrls: [
      "http://localhost:7470",
      "http://localhost:7471",
      "http://localhost:7472",
      "http://localhost:7473",
      "http://localhost:7474",
      "http://localhost:7475",
      "http://localhost:7476",
      "http://localhost:7477",
      "http://localhost:7478",
      "http://localhost:7479",
    ],
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {},
  });

  console.log("results: ", results);
};

go();
