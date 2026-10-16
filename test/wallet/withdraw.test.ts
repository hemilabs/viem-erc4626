import { decodeFunctionData, erc4626Abi, isHex, zeroAddress } from "viem";
import { WalletClient } from "viem";
import { writeContract } from "viem/actions";
import { hemiSepolia } from "viem/chains";
import { describe, it, expect, vi } from "vitest";

import { encodeWithdrawData, withdraw } from "../../src/wallet/withdraw";

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

describe("encodeWithdrawData", function () {
  const validEncodeParameters = {
    assets: BigInt(1000),
    owner: "0x0000000000000000000000000000000000000001",
    receiver: "0x0000000000000000000000000000000000000002",
  } as const;

  it("should throw an error if assets is not a bigint", function () {
    const parameters = { ...validEncodeParameters, assets: 1000 };

    // @ts-expect-error - Testing invalid assets type
    expect(() => encodeWithdrawData(parameters)).toThrow("Invalid assets");
  });

  it("should throw an error if the receiver address is not valid", function () {
    const parameters = {
      ...validEncodeParameters,
      receiver: "invalid_receiver",
    };

    // @ts-expect-error - Testing invalid receiver address
    expect(() => encodeWithdrawData(parameters)).toThrow(
      "Invalid receiver address",
    );
  });

  it("should throw an error if the owner address is not valid", function () {
    const parameters = { ...validEncodeParameters, owner: "invalid_owner" };

    // @ts-expect-error - Testing invalid owner address
    expect(() => encodeWithdrawData(parameters)).toThrow(
      "Invalid owner address",
    );
  });

  it("should throw an error if assets is less than or equal to 0", function () {
    const parameters = { ...validEncodeParameters, assets: BigInt(0) };

    expect(() => encodeWithdrawData(parameters)).toThrow(
      "Invalid assets, must be greater than 0",
    );
  });

  it("should throw an error if the parameters are not defined", function () {
    // @ts-expect-error - Testing undefined parameters
    expect(() => encodeWithdrawData(undefined)).toThrow("Invalid assets");
  });

  it("should return the encoded call data if all parameters are valid", function () {
    const data = encodeWithdrawData(validEncodeParameters);

    expect(isHex(data)).toBe(true);
    expect(decodeFunctionData({ abi: erc4626Abi, data })).toEqual({
      args: [
        validEncodeParameters.assets,
        validEncodeParameters.receiver,
        validEncodeParameters.owner,
      ],
      functionName: "withdraw",
    });
  });
});
