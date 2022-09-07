class Test {
    a = 0
    b = "a"

    constructor() {
        this.a = 1
        this.b = "b"
    }

    main() {
        console.log(Object.assign(new Test(), this))
    }
}

const test = new Test()
const test2 = new Test()
console.log(test.a === test2.a)

