import { decodeFunctionData, erc4626Abi, isHex, zeroAddress } from "viem";
import { WalletClient } from "viem";
import { writeContract } from "viem/actions";
import { hemiSepolia } from "viem/chains";
import { describe, it, expect, vi } from "vitest";

import { encodeRedeemData, redeem } from "../../src/wallet/redeem";

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
      address: validParameters.address,
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

describe("encodeRedeemData", function () {
  const validEncodeParameters = {
    owner: "0x0000000000000000000000000000000000000001",
    receiver: "0x0000000000000000000000000000000000000002",
    shares: BigInt(1000),
  } as const;

  it("should throw an error if shares is not a bigint", function () {
    const parameters = { ...validEncodeParameters, shares: 1000 };

    // @ts-expect-error - Testing invalid shares type
    expect(() => encodeRedeemData(parameters)).toThrow("Invalid shares");
  });

  it("should throw an error if the receiver address is not valid", function () {
    const parameters = {
      ...validEncodeParameters,
      receiver: "invalid_receiver",
    };

    // @ts-expect-error - Testing invalid receiver address
    expect(() => encodeRedeemData(parameters)).toThrow(
      "Invalid receiver address",
    );
  });

  it("should throw an error if the owner address is not valid", function () {
    const parameters = { ...validEncodeParameters, owner: "invalid_owner" };

    // @ts-expect-error - Testing invalid owner address
    expect(() => encodeRedeemData(parameters)).toThrow("Invalid owner address");
  });

  it("should throw an error if shares is less than or equal to 0", function () {
    const parameters = { ...validEncodeParameters, shares: BigInt(0) };

    expect(() => encodeRedeemData(parameters)).toThrow(
      "Invalid shares, must be greater than 0",
    );
  });

  it("should throw an error if the parameters are not defined", function () {
    // @ts-expect-error - Testing undefined parameters
    expect(() => encodeRedeemData(undefined)).toThrow("Invalid shares");
  });

  it("should return the encoded call data if all parameters are valid", function () {
    const data = encodeRedeemData(validEncodeParameters);

    expect(isHex(data)).toBe(true);
    expect(decodeFunctionData({ abi: erc4626Abi, data })).toEqual({
      args: [
        validEncodeParameters.shares,
        validEncodeParameters.receiver,
        validEncodeParameters.owner,
      ],
      functionName: "redeem",
    });
  });
});
