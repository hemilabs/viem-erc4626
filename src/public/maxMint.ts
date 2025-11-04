import { type Address, type Client, erc4626Abi, isAddress } from "viem";
import { readContract } from "viem/actions";

export const maxMint = async function (
  client: Client,
  parameters: { address: Address; receiver: Address },
) {
  const { address, receiver } = parameters ?? {};

  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }
  if (!isAddress(receiver)) {
    throw new Error("Invalid receiver address");
  }

  return readContract(client, {
    abi: erc4626Abi,
    address,
    args: [receiver],
    functionName: "maxMint",
  });
};
