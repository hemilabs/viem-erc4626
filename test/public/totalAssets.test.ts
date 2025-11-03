import { PublicClient, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { describe, it, expect, vi } from "vitest";

import { totalAssets } from "../../src/public/totalAssets";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const validParameters = {
  address: zeroAddress,
};

// @ts-expect-error - We only create an empty client for testing purposes
const client: PublicClient = {};

describe("totalAssets", function () {
  it("should throw an error if the address is not valid", async function () {
    const parameters = { address: "invalid_address" };

    await expect(totalAssets(client, parameters)).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should call readContract if the address is valid", async function () {
    const total = BigInt(50000);

    vi.mocked(readContract).mockResolvedValueOnce(total);

    const result = await totalAssets(client, validParameters);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: validParameters.address,
      functionName: "totalAssets",
    });
    expect(result).toBe(total);
  });

  it("should handle empty parameters gracefully", async function () {
    await expect(totalAssets(client, {})).rejects.toThrow("Invalid address");
  });

  it("should handle no parameters gracefully", async function () {
    await expect(totalAssets(client, undefined)).rejects.toThrow(
      "Invalid address",
    );
  });
});
