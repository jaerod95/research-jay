function car() {
    this.data = "";
    this.speed = 1234;
    this.print = function() {
        console.log(this.speed);
    }
}

var a = new car();

console.log(a.speed);
a.print()