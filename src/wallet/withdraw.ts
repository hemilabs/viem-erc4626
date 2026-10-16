import {
  type Address,
  Client,
  encodeFunctionData,
  erc4626Abi,
  isAddress,
} from "viem";
import { writeContract } from "viem/actions";

type WithdrawParams = {
  assets: bigint;
  owner: Address;
  receiver: Address;
};

const assertWithdrawParams = function (parameters: WithdrawParams) {
  const { assets, owner, receiver } = parameters;
  if (typeof assets !== "bigint") {
    throw new Error("Invalid assets");
  }
  if (!isAddress(receiver)) {
    throw new Error("Invalid receiver address");
  }
  if (!isAddress(owner)) {
    throw new Error("Invalid owner address");
  }
  if (assets <= BigInt(0)) {
    throw new Error("Invalid assets, must be greater than 0");
  }
};

export const withdraw = async function (
  client: Client,
  parameters: WithdrawParams & { address: Address },
) {
  const { address, assets, owner, receiver } = parameters;
  if (!client.account) {
    throw new Error("Client is missing an account");
  }
  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  assertWithdrawParams({ assets, owner, receiver });

  return writeContract(client, {
    abi: erc4626Abi,
    account: client.account,
    address,
    args: [assets, receiver, owner],
    chain: client.chain,
    functionName: "withdraw",
  });
};

export const encodeWithdrawData = function (parameters: WithdrawParams) {
  const { assets, owner, receiver } = parameters ?? {};
  assertWithdrawParams({ assets, owner, receiver });

  return encodeFunctionData({
    abi: erc4626Abi,
    args: [assets, receiver, owner],
    functionName: "withdraw",
  });
};
