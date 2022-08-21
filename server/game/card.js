class Card{
    static GUARD = new Card(1,"Guard",5);
    static PRIEST = new Card(2,"Priest",2);
    static BARON = new Card(3, "Baron",2);
    static HANDMAID = new Card(4,"Handmaid",2);
    static PRINCE = new Card(5,"Prince",2);
    static KING = new Card(6,"King",1);
    static COUNTESS = new Card(7,"Countess",1);
    static PRINCESS = new Card(8,"Princess",1);

    constructor(value, name, count){
        this.value = value;
        this.name = name;
        this.count = count;
    }
    async toValue(){
        return this.value;
    }
    async toStrings(){
        return this.name;
    }
    async toCount(){
        return this.count;
    }
    async createDeck(){
        const deck = new Array();
        const cards = Object.values(Card);
        //console.log(cards);
        while (cards.length > 0){
            var card = cards.pop();
            //console.log(card);
            var cardValues = Object.values(card);
            //console.log();
            for (let i = 0; i < cardValues[2]; i++){
                deck.push(card);
            }
        }
        for (let i = 0; i < 200; i++){
            let index1 = Math.floor(Math.random()*17);
            let index2 = Math.floor(Math.random()*17);
            let tempCard = deck[index1];
            deck[index1] = deck[index2];
            deck[index2] = tempCard;
        }
        //console.log(deck);
        return deck;
    }
    async createDefaultDeck(){
        return this.createDeck(this.randomGen());
    }
    async shuffle(){

    }
    async randomGen(){
        return 0;
    }
}

const card = new Card(1, "Guard", 5);
//console.log(card.toCount());
//console.log(card.toStrings());
//console.log(card.toValue());
//console.log(Object.values(Card));
card.createDeck();