
function Character (name, hp, dame, defense, speed, counterattack) {
    this.name = name;
    this.hp = hp;
    this.dame = dame;
    this.defense = defense;
    this.attacks = function (target) {
        const damage = Math.max(this.dame - target.defense, 0)
        target.hp -= damage;
        console.log(`${this.name} tấn công ${target.name}, gây ra ${damage} sát thương. ${target.name} còn lại ${target.hp} máu.`)

        // xử lý trường hợp phản công
        if (target.isActive() && Math.random() < target.counterattack) {
            const damageCounterattack = Math.max(target.dame - this.defense, 0)
            this.hp -= damageCounterattack
            console.log(`${target.name} phản công ${this.name}, gây ra ${target.counterattack} sát thương. ${this.name} còn lại ${this.hp} máu.`)
        }
    };
    this.isActive = function() {
        return this.hp > 0
    };
    this.speed = speed;
    this.counterattack = counterattack;
}

const tom = new Character("Tom", 1000, 50, 5, 30, 0.5)
const jerry = new Character("Jerry", 500, 20, 20, 50, 0.2)

// Hàm tạo sử lý lượt đánh
function updateSpeed (speed1, speed2) {
    // cho speed1 đánh trước
    speed1.attacks(speed2)

    // đối tượng bị đánh còn sống thì sẽ tấn công lại
    if (speed2.isActive() && speed1.isActive()) {
        speed2.attacks(speed1)
    }
}

let round = 1
function battle(char1, char2) {
    while (char1.isActive() && char2.isActive()) {
        console.log("round", round)

        if (char1.speed > char2.speed) {
            updateSpeed(char1, char2)
        } else {
            updateSpeed(char2, char1)
        }

        round++
    }

    return char1.isActive() ? char1 : char2
}

// jerry.attacks(tom)
console.log(`${battle(tom, jerry).name} wins`)




