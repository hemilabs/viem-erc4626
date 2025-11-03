import { zeroAddress } from "viem";
import { WalletClient } from "viem";
import { writeContract } from "viem/actions";
import { hemiSepolia } from "viem/chains";
import { describe, it, expect, vi } from "vitest";

import { withdraw } from "../../src/wallet/withdraw";

vi.mock("viem/actions", () => ({
  writeContract: vi.fn(),
}));

// @ts-expect-error - We only create an empty client for testing purposes
const client: WalletClient = { account: zeroAddress, chain: hemiSepolia };

const validParameters = {
  address: zeroAddress,
  assets: BigInt(1000),
  owner: zeroAddress,
  receiver: zeroAddress,
};

describe("withdraw", function () {
  it("should throw an error if account is not defined", async function () {
    // @ts-expect-error - We only create an empty client for testing purposes
    const clientWithoutAccount: WalletClient = {};

    await expect(
      withdraw(clientWithoutAccount, validParameters),
    ).rejects.toThrow("Client is missing an account");
  });

  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(withdraw(client, parameters)).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should throw an error if the receiver address is not valid", async function () {
    const parameters = {
      ...validParameters,
      receiver: "invalid_receiver",
    };

    await expect(withdraw(client, parameters)).rejects.toThrow(
      "Invalid receiver address",
    );
  });

  it("should throw an error if the owner address is not valid", async function () {
    const parameters = { ...validParameters, owner: "invalid_owner" };

    await expect(withdraw(client, parameters)).rejects.toThrow(
      "Invalid owner address",
    );
  });

  it("should throw an error if assets is not a bigint", async function () {
    const parameters = { ...validParameters, assets: 1000 };

    await expect(withdraw(client, parameters)).rejects.toThrow(
      "Invalid assets",
    );
  });

  it("should throw an error if assets is less than or equal to 0", async function () {
    const parameters = { ...validParameters, assets: BigInt(0) };

    await expect(withdraw(client, parameters)).rejects.toThrow(
      "Invalid assets, must be greater than 0",
    );
  });

  it("should call writeContract if all parameters are valid", async function () {
    vi.mocked(writeContract).mockResolvedValueOnce({ success: true });

    const result = await withdraw(client, validParameters);

    expect(writeContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      account: client.account,
      address: validParameters.address,
      args: [
        validParameters.assets,
        validParameters.receiver,
        validParameters.owner,
      ],
      chain: client.chain,
      functionName: "withdraw",
    });
    expect(result).toEqual({ success: true });
  });
});
