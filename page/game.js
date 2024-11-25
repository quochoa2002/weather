const tom = {
    name: "Tom",
    hp: 1000,
    dame: 50,
    defense: 5,
    attacks(target) {
        const damage = Math.max(this.dame - target.defense, 0)
        target.hp -= damage;
        console.log(`${this.name} attacks ${target.name} for ${damage} and ${target.name} is ${target.hp}`)
    },
    isActive() {
        return this.hp > 0
    }
}

const jerry = {
    name: "Jerry",
    hp: 500,
    dame: 20,
    defense: 20,
    attacks(target) {
        const damage = Math.max(this.dame - target.defense, 0)
        target.hp -= damage;
        console.log(`${this.name} attacks ${target.name} for ${damage} and ${target.name} is ${target.hp}`)
    },
    isActive() {
        return this.hp > 0
    }
}

let round = 1

// điều kiện kết thúc vòng lặp
while (tom.isActive() && jerry.isActive()) {
    console.log(`round ${round}`)

    if (round % 2 === 0) {
        tom.attacks(jerry)
    } else {
        jerry.attacks(tom)
    }
    
    round++ 
}


// kiểm tra đối tượng wins
if (tom.isActive()) {
    console.log(`${tom.name} wins`)
} else {
    console.log(`${jerry.name} wins`)
}

