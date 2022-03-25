/* eslint-disable no-console */
import { Keyring } from '@polkadot/api'
import { KeypairType } from '@polkadot/util-crypto/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { v4 as uuid } from 'uuid'
import { BN } from '@polkadot/util'
import Big from 'big.js'
import { getXoshiro } from './utils/getXorshiroStates'
import { isInputValid } from './utils/isInputValid'
import { toBN } from './utils/toBn'
import { toFixed } from './utils/toFixed'
import { BN_TEN_THOUSAND } from '.'
import { BIG_HUNDRED } from './utils/bigConstants'

/**
 * @class MangataHelpers
 * @author Mangata Finance
 */
export class MangataHelpers {
  public static createKeyring(type: KeypairType): Keyring {
    return new Keyring({ type })
  }

  public static createKeyPairFromNameAndStoreAccountToKeyring(
    keyring: Keyring,
    name: string = ''
  ): KeyringPair {
    const userName: string = name ? name : '//testUser_' + uuid()
    const account = keyring.createFromUri(userName)
    keyring.addPair(account)
    return account
  }

  public static getXoshiro(seed: Uint8Array) {
    return getXoshiro(seed)
  }

  public static getPriceImpact(
    poolBalance: { firstTokenBalance: BN; secondTokenBalance: BN },
    poolDecimals: { firstTokenDecimals: number; secondTokenDecimals: number },
    firstTokenAmount: string,
    secondTokenAmount: string
  ) {
    if (
      !poolBalance ||
      !poolDecimals ||
      !isInputValid(firstTokenAmount) ||
      !isInputValid(secondTokenAmount)
    ) {
      return
    }

    const firstReserveBefore = poolBalance.firstTokenBalance
    const secondReserveBefore = poolBalance.secondTokenBalance

    const soldAmount = toBN(firstTokenAmount, poolDecimals.firstTokenDecimals)
    const boughtAmount = toBN(secondTokenAmount, poolDecimals.secondTokenDecimals)

    if (soldAmount.gte(firstReserveBefore) || boughtAmount.gte(secondReserveBefore)) return ''

    const numerator = firstReserveBefore
      .add(soldAmount)
      .mul(BN_TEN_THOUSAND)
      .mul(secondReserveBefore)
    const denominator = secondReserveBefore.sub(boughtAmount).mul(firstReserveBefore)

    const res = numerator.div(denominator).sub(BN_TEN_THOUSAND)

    const resStr = res.toString()
    const resBig = Big(resStr)
    const resFormatted = toFixed(resBig.div(BIG_HUNDRED).toString(), 2)

    return resFormatted
  }
}
