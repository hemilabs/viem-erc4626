import { PublicClient, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { describe, it, expect, vi } from "vitest";

import { previewMint } from "../../src/public/previewMint";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const validParameters = {
  address: zeroAddress,
  shares: BigInt(1000),
};

// @ts-expect-error - We only create an empty client for testing purposes
const client: PublicClient = {};

describe("previewMint", function () {
  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(previewMint(client, parameters)).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should throw an error if shares is not a bigint", async function () {
    const parameters = { ...validParameters, shares: 1000 };

    await expect(previewMint(client, parameters)).rejects.toThrow(
      "Invalid shares",
    );
  });

  it("should throw an error if shares is less than 0", async function () {
    const parameters = { ...validParameters, shares: BigInt(-1) };

    await expect(previewMint(client, parameters)).rejects.toThrow(
      "Shares must be greater than or equal to 0",
    );
  });

  it("should call readContract if all parameters are valid", async function () {
    const assets = BigInt(1100);

    vi.mocked(readContract).mockResolvedValueOnce(assets);

    const result = await previewMint(client, validParameters);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: validParameters.address,
      args: [validParameters.shares],
      functionName: "previewMint",
    });
    expect(result).toBe(assets);
  });

  it("should handle empty parameters gracefully", async function () {
    await expect(previewMint(client, {})).rejects.toThrow("Invalid address");
  });

  it("should handle no parameters gracefully", async function () {
    await expect(previewMint(client, undefined)).rejects.toThrow(
      "Invalid address",
    );
  });
});
