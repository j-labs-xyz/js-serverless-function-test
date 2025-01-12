import * as LitJsSdk from "@lit-protocol/lit-node-client";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  const latestNonce = await Lit.Actions.getLatestNonce({ address, chain });
  Lit.Actions.setResponse({response: JSON.stringify({latestNonce})});
};

go();
`;

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
// const authSig = {
//   sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
//   derivedVia: "web3.eth.personal.sign",
//   signedMessage:
//     "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
//   address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
// };

const authSig = {
  sig: "0x889394f6404e7a6cf2de4ad6be2f7b4720529ffa342ee79144b83af14422fb49651471701f81f63278d4dd7987e66581fa712f04477d23075f2d7a55d3a6c1821b",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "collab.land wants you to sign in with your Ethereum account:\n" +
    "0x1F62583538CDB2CB3656Ed43A46693F92DDa6302\n" +
    "\n" +
    "Generate a signature for Lit Actions\n" +
    "\n" +
    "URI: https://collab.land\n" +
    "Version: 1\n" +
    "Chain ID: 80001\n" +
    "Nonce: 6338063869286977\n" +
    "Issued At: 2022-12-14T16:55:16.272Z\n" +
    "Expiration Time: 2022-12-14T17:00:16.272Z\n" +
    "Resources:",
  address: "0x1F62583538CDB2CB3656Ed43A46693F92DDa6302",
};

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      chain: "ethereum",
    },
  });
  console.log("results: ", results);
};

runLitAction();
