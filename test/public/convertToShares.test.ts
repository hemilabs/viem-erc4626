import { PublicClient, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { describe, it, expect, vi } from "vitest";

import { convertToShares } from "../../src/public/convertToShares";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const validParameters = {
  address: zeroAddress,
  assets: BigInt(1000),
};

// @ts-expect-error - We only create an empty client for testing purposes
const client: PublicClient = {};

describe("convertToShares", function () {
  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(convertToShares(client, parameters)).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should throw an error if assets is not a bigint", async function () {
    const parameters = { ...validParameters, assets: 1000 };

    await expect(convertToShares(client, parameters)).rejects.toThrow(
      "Invalid assets",
    );
  });

  it("should throw an error if assets is less than 0", async function () {
    const parameters = { ...validParameters, assets: BigInt(-1) };

    await expect(convertToShares(client, parameters)).rejects.toThrow(
      "Assets must be greater than or equal to 0",
    );
  });

  it("should call readContract if all parameters are valid", async function () {
    const shares = BigInt(500);

    vi.mocked(readContract).mockResolvedValueOnce(shares);

    const result = await convertToShares(client, validParameters);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: validParameters.address,
      args: [validParameters.assets],
      functionName: "convertToShares",
    });
    expect(result).toBe(shares);
  });

  it("should handle empty parameters gracefully", async function () {
    await expect(convertToShares(client, {})).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should handle no parameters gracefully", async function () {
    await expect(convertToShares(client, undefined)).rejects.toThrow(
      "Invalid address",
    );
  });
});
