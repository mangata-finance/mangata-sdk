import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenAmount, TokenId } from "../../types/common";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const calculateSellPriceId = async (
  instancePromise: Promise<ApiPromise>,
  soldTokenId: TokenId,
  boughtTokenId: TokenId,
  amount: TokenAmount
) => {
  logger.info("calculateSellPriceId", {
    soldTokenId,
    boughtTokenId,
    amount: amount.toString()
  });
  const api = await instancePromise;
  const result = await (api.rpc as any).xyk.calculate_sell_price_id(
    soldTokenId,
    boughtTokenId,
    amount
  );
  return new BN(result.price);
};
