import type { Account, Chain, Client, Transport } from "viem";

import {
  approve,
  allowance,
  balanceOf,
  decimals,
  name,
  symbol,
  totalSupply,
} from "viem-erc20/actions";

import { asset } from "./public/asset.js";
import { convertToAssets } from "./public/convertToAssets.js";
import { convertToShares } from "./public/convertToShares.js";
import { maxDeposit } from "./public/maxDeposit.js";
import { maxMint } from "./public/maxMint.js";
import { maxRedeem } from "./public/maxRedeem.js";
import { maxWithdraw } from "./public/maxWithdraw.js";
import { previewDeposit } from "./public/previewDeposit.js";
import { previewMint } from "./public/previewMint.js";
import { previewRedeem } from "./public/previewRedeem.js";
import { previewWithdraw } from "./public/previewWithdraw.js";
import { totalAssets } from "./public/totalAssets.js";
import { deposit } from "./wallet/deposit.js";
import { mint } from "./wallet/mint.js";
import { redeem } from "./wallet/redeem.js";
import { withdraw } from "./wallet/withdraw.js";

// for .extend() usage
export const erc4626PublicActions =
  () =>
  <
    TTransport extends Transport = Transport,
    TChain extends Chain | undefined = Chain | undefined,
    TAccount extends Account | undefined = Account | undefined,
  >(
    client: Client<TTransport, TChain, TAccount>,
  ) => ({
    allowance: (params: Parameters<typeof allowance>[1]) =>
      allowance(client, params),
    asset: (params: Parameters<typeof asset>[1]) => asset(client, params),
    balanceOf: (params: Parameters<typeof balanceOf>[1]) =>
      balanceOf(client, params),
    convertToAssets: (params: Parameters<typeof convertToAssets>[1]) =>
      convertToAssets(client, params),
    convertToShares: (params: Parameters<typeof convertToShares>[1]) =>
      convertToShares(client, params),
    decimals: (params: Parameters<typeof decimals>[1]) =>
      decimals(client, params),
    maxDeposit: (params: Parameters<typeof maxDeposit>[1]) =>
      maxDeposit(client, params),
    maxMint: (params: Parameters<typeof maxMint>[1]) => maxMint(client, params),
    maxRedeem: (params: Parameters<typeof maxRedeem>[1]) =>
      maxRedeem(client, params),
    maxWithdraw: (params: Parameters<typeof maxWithdraw>[1]) =>
      maxWithdraw(client, params),
    name: (params: Parameters<typeof name>[1]) => name(client, params),
    previewDeposit: (params: Parameters<typeof previewDeposit>[1]) =>
      previewDeposit(client, params),
    previewMint: (params: Parameters<typeof previewMint>[1]) =>
      previewMint(client, params),
    previewRedeem: (params: Parameters<typeof previewRedeem>[1]) =>
      previewRedeem(client, params),
    previewWithdraw: (params: Parameters<typeof previewWithdraw>[1]) =>
      previewWithdraw(client, params),
    symbol: (params: Parameters<typeof symbol>[1]) => symbol(client, params),
    totalAssets: (params: Parameters<typeof totalAssets>[1]) =>
      totalAssets(client, params),
    totalSupply: (params: Parameters<typeof totalSupply>[1]) =>
      totalSupply(client, params),
  });

// for .extend() usage
export const erc4626WalletActions = () => (client: Client) => ({
  approve: (params: Parameters<typeof approve>[1]) => approve(client, params),
  deposit: (params: Parameters<typeof deposit>[1]) => deposit(client, params),
  mint: (params: Parameters<typeof mint>[1]) => mint(client, params),
  redeem: (params: Parameters<typeof redeem>[1]) => redeem(client, params),
  withdraw: (params: Parameters<typeof withdraw>[1]) =>
    withdraw(client, params),
});
