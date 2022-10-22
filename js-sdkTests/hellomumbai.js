import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the response from the node
  // and combined into a full signature by the LitJsSdk for you to use on the client
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
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

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    debug: true,
    litNetwork: "custom",
    bootstrapUrls: [
      "https://polygon-mumbai.litgateway.com:7370",
      "https://polygon-mumbai.litgateway.com:7371",
      "https://polygon-mumbai.litgateway.com:7372",
      "https://polygon-mumbai.litgateway.com:7373",
      "https://polygon-mumbai.litgateway.com:7374",
      "https://polygon-mumbai.litgateway.com:7375",
      "https://polygon-mumbai.litgateway.com:7376",
      "https://polygon-mumbai.litgateway.com:7377",
      "https://polygon-mumbai.litgateway.com:7378",
      "https://polygon-mumbai.litgateway.com:7379",
    ],
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x04437434ae9a4960e0fa4f7e4e563da18b6a87a9667a3651179b44a632e36fb0353beaed613aa60bc62567e2ddcf0d88260eca6239268c0e912b7adcebc7206ddd",
      sigName: "sig1",
    },
  });
  console.log("results: ", results);
};

runLitAction();