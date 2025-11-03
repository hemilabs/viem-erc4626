// erc-4626 is an extension of erc-20, so we re-export all erc-20 actions
export {
  // TODO update names - see https://github.com/hemilabs/viem-erc20/issues/7
  approveErc20Token as approve,
  getErc20TokenAllowance as allowance,
  getErc20TokenBalance as balanceOf,
  getErc20TokenDecimals as decimals,
  getErc20TokenName as name,
  getErc20TokenSymbol as symbol,
  getErc20TokenTotalSupply as totalSupply,
} from "viem-erc20/actions";

export { asset } from "../public/asset.js";
export { convertToAssets } from "../public/convertToAssets.js";
export { convertToShares } from "../public/convertToShares.js";
export { maxDeposit } from "../public/maxDeposit.js";
export { maxMint } from "../public/maxMint.js";
export { maxRedeem } from "../public/maxRedeem.js";
export { maxWithdraw } from "../public/maxWithdraw.js";
export { previewDeposit } from "../public/previewDeposit.js";
export { previewMint } from "../public/previewMint.js";
export { previewRedeem } from "../public/previewRedeem.js";
export { previewWithdraw } from "../public/previewWithdraw.js";
export { totalAssets } from "../public/totalAssets.js";
export { deposit } from "../wallet/deposit.js";
export { mint } from "../wallet/mint.js";
export { redeem } from "../wallet/redeem.js";
export { withdraw } from "../wallet/withdraw.js";
