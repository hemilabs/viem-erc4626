import { zeroAddress } from "viem";
import { WalletClient } from "viem";
import { writeContract } from "viem/actions";
import { hemiSepolia } from "viem/chains";
import { describe, it, expect, vi } from "vitest";

import { redeem } from "../../src/wallet/redeem";

vi.mock("viem/actions", () => ({
  writeContract: vi.fn(),
}));

// @ts-expect-error - We only create an empty client for testing purposes
const client: WalletClient = { account: zeroAddress, chain: hemiSepolia };

const validParameters = {
  address: zeroAddress,
  owner: zeroAddress,
  receiver: zeroAddress,
  shares: BigInt(1000),
};

describe("redeem", function () {
  it("should throw an error if client.account is not defined", async function () {
    // @ts-expect-error - We only create an empty client for testing purposes
    const clientWithoutAccount: WalletClient = {};

    await expect(redeem(clientWithoutAccount, validParameters)).rejects.toThrow(
      "Client is missing an account",
    );
  });

  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(redeem(client, parameters)).rejects.toThrow("Invalid address");
  });

  it("should throw an error if the receiver address is not valid", async function () {
    const parameters = {
      ...validParameters,
      receiver: "invalid_receiver",
    };

    await expect(redeem(client, parameters)).rejects.toThrow(
      "Invalid receiver address",
    );
  });

  it("should throw an error if the owner address is not valid", async function () {
    const parameters = { ...validParameters, owner: "invalid_owner" };

    await expect(redeem(client, parameters)).rejects.toThrow(
      "Invalid owner address",
    );
  });

  it("should throw an error if shares is not a bigint", async function () {
    const parameters = { ...validParameters, shares: 1000 };

    await expect(redeem(client, parameters)).rejects.toThrow("Invalid shares");
  });

  it("should throw an error if shares is less than or equal to 0", async function () {
    const parameters = { ...validParameters, shares: BigInt(0) };

    await expect(redeem(client, parameters)).rejects.toThrow(
      "Invalid shares, must be greater than 0",
    );
  });

  it("should call writeContract if all parameters are valid", async function () {
    const parameters = { ...validParameters };

    vi.mocked(writeContract).mockResolvedValueOnce({ success: true });

    const result = await redeem(client, parameters);

    expect(writeContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      account: client.account,
      address: zeroAddress,
      args: [
        validParameters.shares,
        validParameters.receiver,
        validParameters.owner,
      ],
      chain: client.chain,
      functionName: "redeem",
    });
    expect(result).toEqual({ success: true });
  });
});
