import invariant from 'tiny-invariant'
import { Currency } from './Currency'
import { Token } from './Token'

import { Chain, chains } from 'chain'

export const WNATIVE: { [chainId: number]: Token } = {
  [1]: new Token({
    chainId: 1,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
}

export class Native extends Currency {
  public readonly isNative: true = true
  public readonly isToken: false = false
  public readonly symbol: string
  public readonly name: string
  public constructor(native: { chainId: number; decimals: number; symbol: string; name: string }) {
    super(native)
    this.symbol = native.symbol
    this.name = native.name
  }
  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId]
    invariant(!!wnative, 'WRAPPED')
    return wnative
  }

  private static cache: { [chainId: number]: Native } = {}

  public static onChain(chainId: number): Native {
    if (chainId in this.cache) {
      return this.cache[chainId]
    }

    const chain: Chain | undefined = chains.find((chain) => chain.chainId === chainId)

    invariant(!!chain, 'CHAIN')

    const { nativeCurrency } = chain

    invariant(!!nativeCurrency, 'NATIVE_CURRENCY')

    const { decimals, name, symbol } = nativeCurrency

    return new Native({ chainId, decimals, name, symbol })
  }

  public equals(other: Native | Token): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}