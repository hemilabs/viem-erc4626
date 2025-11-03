import { type Address, type Client, erc4626Abi, isAddress } from "viem";
import { readContract } from "viem/actions";

export const maxRedeem = async function (
  client: Client,
  parameters: { address: Address; owner: Address },
) {
  const { address, owner } = parameters ?? {};

  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  if (!isAddress(owner)) {
    throw new Error("Invalid owner address");
  }

  return readContract(client, {
    abi: erc4626Abi,
    address,
    args: [owner],
    functionName: "maxRedeem",
  });
};
