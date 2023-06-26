import { serialize, computeAddress } from "@ethersproject/transactions";
import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "js-sha3";

console.log("running!");

// generic auth signature with a permitted address.
const pkp = {
  "status": "Succeeded",
  "pkpTokenId": "0x7a321ff34aed15db69686e0d3e833b7492d8474410560de7a7ebb46e04ee185a",
  "pkpEthAddress": "0x4C07b20Dd2969D15A0acdb42cd9Ed85b64b87841",
  "pkpPublicKey": "0x041655dec62e6715a882915ccd0d77c133491c817ff55db2460ce862084a06d32a56448a001ad137c1d9700840cbab8caf7cb5682fe0524a0ea831ba5907221a41"
};

const toAddress = "0x535b0dABaF59c90EeeBEf272b5F778C5369a1445"; // J Labs test account
const chainId = 80001; // Polygon Mumbai Testnet

const go = async () => {
  const fromAddress = pkp.pkpEthAddress;
  // get latest nonce
  const latestNonce = await Lit.Actions.getLatestNonce({
    address: fromAddress,
    chain: "mumbai",
  });

  const txParams = {
    nonce: latestNonce,
    gasPrice: "0x2e90edd000", // 200 gwei
    gasLimit: "0x" + (30000).toString(16), // 30k gas limit should be enough.  only need 21k to send.
    to: toAddress,
    value: "0x" + (10000000).toString(16),
    chainId,
  };
  
  Lit.Actions.setResponse({ response: JSON.stringify({ txParams }) });

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
    publicKey: pkp.pkpPublicKey,
    sigName: "sig1",
  });
  console.log("sig: ", sig);
};

go();
