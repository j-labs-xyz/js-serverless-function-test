import { serialize, computeAddress } from "@ethersproject/transactions";
import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "js-sha3";

console.log("running!");

// generic auth signature with a permitted address.
const pkp = {
  "status": "Succeeded",
  "pkpTokenId": "0xc6e9447d16efc10f6043ff475622af9df1a3a29f7d53aa474ab2466b33e6b725",
  "pkpEthAddress": "0x8C433380fF7c82dE5A2e10D5D1853B56a2Ef24Aa",
  "pkpPublicKey": "0x046a09847761ecea0cd71d38ede2498b8ce382b7dda6595cd786eb312839633ad2cbeb4a955db881f638d149298a7ab24183c366cc8281969a50df11edb66149aa"
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
