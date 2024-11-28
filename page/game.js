
function Character (name, hp, dame, defense, speed) {
    this.name = name;
    this.hp = hp;
    this.dame = dame;
    this.defense = defense;
    this.attacks = function (target) {
        const damage = Math.max(this.dame - target.defense, 0)
        target.hp -= damage;
        console.log(`${this.name} tấn công ${target.name}, gây ra ${damage} sát thương. ${target.name} còn lại ${target.hp} máu.`)
    };
    this.isActive = function() {
        return this.hp > 0
    };
    this.speed = speed;
}

const tom = new Character("Tom", 1000, 50, 5, 30)
const jerry = new Character("Jerry", 500, 20, 20, 50)

function updateSpeed (speed1, speed2) {
    speed1.attacks(speed2)
    speed2.isActive() && speed2.attacks(speed1)
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

console.log(`${battle(tom, jerry).name} wins`)




