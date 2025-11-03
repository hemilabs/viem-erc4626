import { type Address, type Client, erc4626Abi, isAddress } from "viem";
import { readContract } from "viem/actions";

export const previewDeposit = async function (
  client: Client,
  parameters: { address: Address; assets: bigint },
) {
  const { address, assets } = parameters ?? {};

  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  if (typeof assets !== "bigint") {
    throw new Error("Invalid assets");
  }
  if (assets < BigInt(0)) {
    throw new Error("Assets must be greater than or equal to 0");
  }

  return readContract(client, {
    abi: erc4626Abi,
    address,
    args: [assets],
    functionName: "previewDeposit",
  });
};
