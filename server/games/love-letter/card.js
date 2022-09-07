import seedrandom from 'seedrandom'

/**
 * An enumeration of the card types
 * Cards are immutable
 **/
class Card {
    static GUARD = new Card(1, "Guard", 5)
    static PRIEST = new Card(2, "Priest", 2)
    static BARON = new Card(3, "Baron", 2)
    static HANDMAID = new Card(4, "Handmaid", 2)
    static PRINCE = new Card(5, "Prince", 2)
    static KING = new Card(6, "King", 1)
    static COUNTESS = new Card(7, "Countess", 1)
    static PRINCESS = new Card(8, "Princess", 1)

    /**
     * Creates the card with value, name and count.
     * @param value the value of the card
     * @param name the name of the card
     * @param count the number of instances of the card in a standard deck
     **/
    constructor(value, name, count) {
        this.value = value
        this.name = name
        this.count = count
    }

    /**
     * Creates a shuffled deck of cards
     * @return an array of cards representing a standard deck of loveletter cards, in random order.
     **/
    static createDeck(random=seedrandom()) {
        const deck = new Array(16)
        const cards = Object.values(Card)

        let j = 0
        for (const card of cards) {
            for (let i = 0; i < card.count; i++) {
                deck[j++] = card
            }
        }

        for (let i = 0; i < 200; i++) {
            const index1 = parseInt(random.double() * 16)
            const index2 = parseInt(random.double() * 16)
            const tempCard = deck[index1]
            deck[index1] = deck[index2]
            deck[index2] = tempCard
        }
            
        return deck
    }
}

export default Card