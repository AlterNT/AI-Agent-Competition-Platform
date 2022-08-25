/**
 * An enumeration of the card types
 * Cards are immutable
 */
class Card {
    static GUARD = new Card(1, "Guard", 5);
    static PRIEST = new Card(2, "Priest", 2);
    static BARON = new Card(3, "Baron", 2);
    static HANDMAID = new Card(4, "Handmaid", 2);
    static PRINCE = new Card(5, "Prince", 2);
    static KING = new Card(6, "King", 1);
    static COUNTESS = new Card(7, "Countess", 1);
    static PRINCESS = new Card(8, "Princess", 1);
    /**
     * Creates the card with value, name and count.
     * @param value the value of the card
     * @param name the name of the card
     * @param count the number of instances of the card in a standard deck
     */
    constructor(value, name, count) {
        this.value = value;
        this.name = name;
        this.count = count;
    }
    /**
     * @return the value of the card
     */
    async toValue() {
        return this.value;
    }
    /**
     * @return the name of the card
     */
    async toStrings() {
        return this.name;
    }
    /**
     * @return the number of times the card appears in the deck
     */
    async toCount() {
        return this.count;
    }
    /**
     * Creates a shuffled deck of cards
     * @return an array of cards representing a standard deck of loveletter cards, in random order.
     */
    async createDeck() {
        const deck = new Array();
        const cards = Object.values(Card);
        while (cards.length > 0) {
            var card = cards.pop();
            var cardValues = Object.values(card);
            for (let i = 0; i < cardValues[2]; i++) {
                deck.push(card);
            }
        }
        for (let i = 0; i < 200; i++) {
            let index1 = Math.floor(Math.random() * 16);
            let index2 = Math.floor(Math.random() * 16);
            let tempCard = deck[index1];
            deck[index1] = deck[index2];
            deck[index2] = tempCard;
        }
        console.log(deck);
        return deck;
    }
}
