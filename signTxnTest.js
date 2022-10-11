import { serialize } from "@ethersproject/transactions";
import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "js-sha3";

console.log("running!");

// Convert a hex string to a byte array
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

const getNonce = async (ethAddress) => {
  const url = "https://polygon-rpc.com";
  const data = {
    jsonrpc: "2.0",
    method: "eth_getTransactionCount",
    params: [ethAddress, "latest"],
    id: 1,
  };
  const nonceResp = await fetch(url, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
  return nonceResp.result;
};

const go = async () => {
  const fromAddress = "0x4cacaeae4678e83316d4b376e9158c548ab0e8dd";
  // get latest nonce
  const nonce = await getNonce(fromAddress);
  console.log("latest nonce: ", nonce);

  const txParams = {
    nonce: "0x0",
    gasPrice: "0x2e90edd000", // 200 gwei
    gasLimit: "0x" + (30000).toString(16), // 30k gas limit should be enough.  only need 21k to send.
    to: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
    value: "0x" + (10000).toString(16),
    chainId: 137,
  };
  console.log("txParams", txParams);

  const serializedTx = serialize(txParams);
  console.log("serializedTx", serializedTx);

  const rlpEncodedTxn = arrayify(serializedTx);
  console.log("rlpEncodedTxn: ", rlpEncodedTxn);

  // const unsignedTxn = arrayify("0x" + keccak256(rlpEncodedTxn));
  // console.log("unsignedTxn: ", unsignedTxn);

  const unsignedTxn = keccak256.digest(rlpEncodedTxn);
  console.log("unsignedTxn: ", unsignedTxn);

  const toSign = unsignedTxn; //[65, 65, 65]; // this is the string "AAA" for testing
  const sig = await LitActions.signEcdsa({
    toSign,
    publicKey:
      "0x025e34d804b9ee2457e0595e7e457ba84904a138fef1566ff882d030daba14e32e",
    sigName: "sig1",
  });
  console.log("sig: ", sig);
};

go();
