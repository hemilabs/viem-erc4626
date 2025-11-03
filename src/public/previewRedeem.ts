import { type Address, type Client, erc4626Abi, isAddress } from "viem";
import { readContract } from "viem/actions";

export const previewRedeem = async function (
  client: Client,
  parameters: { address: Address; shares: bigint },
) {
  const { address, shares } = parameters ?? {};

  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  if (typeof shares !== "bigint") {
    throw new Error("Invalid shares");
  }
  if (shares < BigInt(0)) {
    throw new Error("Shares must be greater than or equal to 0");
  }

  return readContract(client, {
    abi: erc4626Abi,
    address,
    args: [shares],
    functionName: "previewRedeem",
  });
};
