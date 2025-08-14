export function useConstants() {
    const coefPair = 'pair'
    const coefFullHouse = 'fullHouse'
    const coefBalut = 'balut'
    const coefStraight = 'straight'
    const coefOther = 'other'

    const combos = [
        { title: 'Pair', x: 'x2', value: coefPair },
        { title: 'Full house', x: 'x3', value: coefFullHouse },
        { title: 'Balut', x: 'x4', value: coefBalut },
        { title: 'Straight', x: 'x5', value: coefStraight },
        { title: 'Other', x: 'x0', value: coefOther }
    ]

    const WIN_MULTIPLIERS = {
        [coefPair]: 2,
        [coefFullHouse]: 3,
        [coefBalut]: 4,
        [coefStraight]: 5,
        [coefOther]: 0
    }

    return {
        coefPair,
        coefFullHouse,
        coefBalut,
        coefStraight,
        coefOther,
        combos,
        WIN_MULTIPLIERS
    }
}
