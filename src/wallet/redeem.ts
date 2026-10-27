import {
  type Address,
  Client,
  encodeFunctionData,
  erc4626Abi,
  isAddress,
} from "viem";
import { writeContract } from "viem/actions";

import { assertAddress, assertPositiveBigInt } from "../assert.js";

type RedeemParams = {
  owner: Address;
  receiver: Address;
  shares: bigint;
};

const assertRedeemParams = function (parameters: RedeemParams) {
  const { owner, receiver, shares } = parameters;
  assertPositiveBigInt(shares, "shares");
  assertAddress(receiver, "receiver");
  assertAddress(owner, "owner");
};

export const redeem = async function (
  client: Client,
  parameters: RedeemParams & { address: Address },
) {
  const { address, owner, receiver, shares } = parameters;
  if (!client.account) {
    throw new Error("Client is missing an account");
  }
  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  assertRedeemParams(parameters);

  return writeContract(client, {
    abi: erc4626Abi,
    account: client.account,
    address,
    args: [shares, receiver, owner],
    chain: client.chain,
    functionName: "redeem",
  });
};

export const encodeRedeemData = function (parameters: RedeemParams) {
  const { owner, receiver, shares } = parameters ?? {};
  assertRedeemParams({ owner, receiver, shares });

  return encodeFunctionData({
    abi: erc4626Abi,
    args: [shares, receiver, owner],
    functionName: "redeem",
  });
};
