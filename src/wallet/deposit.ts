import {
  type Address,
  Client,
  encodeFunctionData,
  erc4626Abi,
  isAddress,
} from "viem";
import { writeContract } from "viem/actions";

type DepositParams = {
  assets: bigint;
  receiver: Address;
};

const assertDepositParams = function (parameters: DepositParams) {
  const { assets, receiver } = parameters;
  if (typeof assets !== "bigint") {
    throw new Error("Invalid assets");
  }
  if (!isAddress(receiver)) {
    throw new Error("Invalid receiver address");
  }
  if (assets <= BigInt(0)) {
    throw new Error("Invalid assets, must be greater than 0");
  }
};

export const deposit = async function (
  client: Client,
  parameters: DepositParams & { address: Address },
) {
  const { address, assets, receiver } = parameters;
  if (!client.account) {
    throw new Error("Client is missing an account");
  }
  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  assertDepositParams(parameters);

  return writeContract(client, {
    abi: erc4626Abi,
    account: client.account,
    address,
    args: [assets, receiver],
    chain: client.chain,
    functionName: "deposit",
  });
};

export const encodeDepositData = function (parameters: DepositParams) {
  const { assets, receiver } = parameters ?? {};
  assertDepositParams({ assets, receiver });

  return encodeFunctionData({
    abi: erc4626Abi,
    args: [assets, receiver],
    functionName: "deposit",
  });
};
