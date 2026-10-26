import { type Address, Client, erc4626Abi, isAddress } from "viem";
import { writeContract } from "viem/actions";

import { assertAddress, assertPositiveBigInt } from "../assert.js";

export const mint = async function (
  client: Client,
  parameters: {
    address: Address;
    receiver: Address;
    shares: bigint;
  },
) {
  const { address, receiver, shares } = parameters;
  if (!client.account) {
    throw new Error("Client is missing an account");
  }
  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  assertPositiveBigInt(shares, "shares");
  assertAddress(receiver, "receiver");

  return writeContract(client, {
    abi: erc4626Abi,
    account: client.account,
    address,
    args: [shares, receiver],
    chain: client.chain,
    functionName: "mint",
  });
};
