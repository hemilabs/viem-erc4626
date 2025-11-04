import { type Address, Client, erc4626Abi, isAddress } from "viem";
import { writeContract } from "viem/actions";

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
  if (typeof shares !== "bigint") {
    throw new Error("Invalid shares");
  }
  if (!isAddress(receiver)) {
    throw new Error("Invalid receiver address");
  }
  if (shares <= BigInt(0)) {
    throw new Error("Invalid shares, must be greater than 0");
  }

  return writeContract(client, {
    abi: erc4626Abi,
    account: client.account,
    address,
    args: [shares, receiver],
    chain: client.chain,
    functionName: "mint",
  });
};
