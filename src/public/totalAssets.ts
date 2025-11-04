import { type Address, type Client, erc4626Abi, isAddress } from "viem";
import { readContract } from "viem/actions";

export const totalAssets = async function (
  client: Client,
  parameters: { address: Address },
) {
  const { address } = parameters ?? {};

  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }

  return readContract(client, {
    abi: erc4626Abi,
    address,
    functionName: "totalAssets",
  });
};
