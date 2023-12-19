const operators = ["NOT","+","<->", "|", "->", "*", "XOR"]; // "NOT",  "<->", "|", "->", 
// const neededOperators = ["*", "+"];
const usedVariables = ["A", "B", "C", "D"];// 
const symbols = operators + usedVariables;
const boolValues = [0,1];

class Node{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}


class Tree{

    constructor(){
        this.root = null;       
    }
}

class BooleanTree extends Tree{
    constructor(){
        super();
        this.operations = null;
        this.variables = null;
        this.varTable = null;
        this.finalResult = [];
        this.SDNF = null;
        this.SKNF = null;
    }

    //Функция собирает дерево
    createTree(numVariables, numOperators){
        this.variables = numVariables;
        this.setVariables(this.variables);
        this.operations = numOperators;
        let queue = [];
        let newNode = new Node(operators[Math.floor(Math.random() * operators.length)]);
        numOperators--;
        this.root = newNode;
        if(newNode.value === "NOT")
        {
            newNode.right = new Node(null);
            queue.push(newNode.right)
        }
        else {
            newNode.left = new Node(null); // сделать проверку на NOT, исправив говнокод
            newNode.right = new Node(null);
            queue.push(newNode.left, newNode.right);
        }

        while(numOperators){
            newNode = queue.shift();
            newNode.value = operators[Math.floor(Math.random()*operators.length)]; 
            if(operators.includes(newNode.value))
            {
                if(newNode.value === "NOT")
                {
                    newNode.right = new Node(null);
                    queue.push(newNode.right);
                }
                else{
                    numOperators--;
                    newNode.left = new Node(null);
                    newNode.right = new Node(null);
                    queue.push(newNode.left, newNode.right);
                }
            }
        }

        let k = 0;
        for(let i = 0; i < queue.length; i++)
        {
            if(k === this.variables)
            k = 0;
            queue[i].value = usedVariables[k];
            k++;
        }

        this.resultOfFunction(this);
        console.log(this.finalResult);

        this.toSDNF();
        this.toSKNF();

    }

    //Функция ставит скобки
    setBrackets(currentString,currentNode){
        let openBracket = new Node("(");
        let closeBracket = new Node(")");
        let currentIndex = currentString.indexOf(currentNode)

        if(operators.includes(currentNode.value) && currentNode.value != "NOT")
        {
            currentString.splice(currentIndex,0,openBracket);
            currentIndex++;
            currentString.splice(currentIndex+1,0,closeBracket);
        }

        if(currentNode.left != null && currentNode.right != null)
        {
            currentString.splice(currentIndex,0,currentNode.left);
            currentIndex++;
            currentString.splice(currentIndex+1,0,currentNode.right);
            this.setBrackets(currentString,currentNode.left);
            this.setBrackets(currentString,currentNode.right);
        }

        if(currentNode.left === null && currentNode.right != null)
        {
            currentString.splice(currentIndex+1,0,currentNode.right);
            this.setBrackets(currentString,currentNode.right);
        }

        return currentString;
    }

    // Функция выводит готовую строку
    getString(){
        if(this.root === null) return false
        let currentString = [];

        let finalString = []
        let currentNode = this.root;

        currentString.push(currentNode)
        if(currentNode.left != null)
        {
            currentString.unshift(currentNode.left);
        }
        
        currentString.push(currentNode.right);

        if(currentNode.left != null){
            currentString = this.setBrackets(currentString,currentNode.left);
        }
        
        currentString = this.setBrackets(currentString,currentNode.right);

        for(let i = 0; i < currentString.length; i++)
            finalString[i] = currentString[i].value;

        return finalString.join(' ');
    }

    // Функция идёт по всему дереву
    resultOfFunction(Tree){
        let iterations = 0;
        let finalMass = [];
        let clonnedTree = structuredClone(Tree);

        if(clonnedTree.variables === 3)
        while(iterations < 8)
        {
            this.printTree(clonnedTree.root, iterations, finalMass);          
            // console.log(finalMass);
            this.finalResult.push(finalMass[finalMass.length - 1]);
            // console.log(this.finalResult);
            //boolTable.innerHTML += "<p>" + this.varTable["A"][iterations] + " " + this.varTable["B"][iterations] + " " + this.varTable["C"][iterations] + " " + "|" + " " + finalMass.pop() + "</p>";
            iterations++;
            finalMass = [];
            clonnedTree = structuredClone(Tree);
        }

        if(clonnedTree.variables === 4) // сделать для 4 переменных
        while(iterations < 16)
        {
            this.printTree(clonnedTree.root, iterations, finalMass);          
            // console.log(finalMass);
            this.finalResult.push(finalMass[finalMass.length - 1]);
            // console.log(this.finalResult);
            //boolTable.innerHTML += "<p>" + this.varTable["A"][iterations] + " " + this.varTable["B"][iterations] + " " + this.varTable["C"][iterations] + " " + this.varTable["D"][iterations] + " " + "|" + " " + finalMass.pop() + "</p>";
            iterations++;
            finalMass = [];
            clonnedTree = structuredClone(Tree);
        }

    }

    // Рекурсивная функция, проходится по нодам и листьям, выполняет логические операции
    printTree(currentNode, iterations, finalMass){
        if(currentNode.left != null & currentNode.right != null)
        {
            this.printTree(currentNode.left, iterations, finalMass);
            this.printTree(currentNode.right, iterations, finalMass);
        }

        if(currentNode.left === null & currentNode.right != null)
        {
            this.printTree(currentNode.right, iterations, finalMass);
        }
 
        if(currentNode.value === "XOR"){
            currentNode.value = this.resultOfXOR(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

        if(currentNode.value === "*"){
            currentNode.value = this.resultOfConuction(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

        if(currentNode.value === "+"){
            currentNode.value = this.resultOfDisunction(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

        if(currentNode.value === "<->"){
            currentNode.value = this.resultOfEkviv(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

        if(currentNode.value === "->"){
            currentNode.value = this.resultOfImplication(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

        if(currentNode.value === "|"){
            currentNode.value = this.resultOfShtrih(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

        if(currentNode.value === "|>"){
            currentNode.value = this.resultOfPirsArrow(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

        if(currentNode.value === "NOT"){
            currentNode.value = this.resultOfNOT(currentNode, iterations);
            finalMass.push(currentNode.value);
        }

    }

    //функция, которая преобразует в СДНФ по таблице истинности
    toSDNF(){
        let finalSDNF = [];
        for(let i = 0; i < this.finalResult.length; i++)
        {
            if(this.finalResult[i] === 1)
            finalSDNF.push(this.disunction(i));
        }

        this.SDNF = finalSDNF;

        if(finalSDNF.length === 0)
        {
            this.SDNF = null;
            // return "СДНФ не существует";
        }

        // return finalSDNF.join(' + ');
    }

    disunction(index){
        let result = [];
        let currentVar = null;
        for(let k = 0; k < this.variables; k++)
        {
            currentVar = this.varTable[usedVariables[k]][index] === 0 ? "NOT " + usedVariables[k] : usedVariables[k];
            result.push(currentVar);
        }
        return result.join('*');
    }

    //функция, которая преобразует в СКНФ по таблице истинности
    toSKNF(){
        let finalSKNF = [];
        for(let i = 0; i < this.finalResult.length; i++)
        {
            if(this.finalResult[i] === 0)
            finalSKNF.push("("+ this.conunction(i)+")");
        }

        this.SKNF = finalSKNF;

        if(finalSKNF.length === 0)
        {
            this.SKNF = null;
            // return "СКНФ не существует";
        }
        

        // return finalSKNF.join(' * ');
    }

    conunction(index){
        let result = [];
        let currentVar = null;
        for(let k = 0; k < this.variables; k++)
        {
            currentVar = this.varTable[usedVariables[k]][index] === 1 ? "NOT " + usedVariables[k] : usedVariables[k];
            result.push(currentVar);
        }
        return result.join('+');
    }

    // Функция проставляет значения переменных
    setVariables(numVariables){
        if(numVariables === 3)
        {
            this.varTable = {
                A: [0, 0, 0, 0, 1, 1, 1, 1],
                B: [0, 0, 1, 1, 0, 0, 1, 1],
                C: [0, 1, 0, 1, 0, 1, 0, 1]
            }
        }

        if(numVariables === 4)
        {
            this.varTable = {
                A: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
                B: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
                C: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
                D: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            }
        }
    }

    // XOR
    resultOfXOR(currentNode, iterationNumber){
        /*X  Y  F
          0  0  0
          0  1  1
          1  0  1
          1  1  0
           */
        
        
            let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
            let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

            if(X === 0 & Y === 0) return 0;
            if(X === 0 & Y === 1) return 1;
            if(X === 1 & Y === 0) return 1;
            if(X === 1 & Y === 1) return 0;
    }

    //->
    resultOfImplication(currentNode, iterationNumber){
        /*X  Y  F
          0  0  1
          0  1  1
          1  0  0
          1  1  1
           */

        let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
        let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

        if(X === 0 & Y === 0) return 1;
        if(X === 0 & Y === 1) return 1;
        if(X === 1 & Y === 0) return 0;
        if(X === 1 & Y === 1) return 1;
    }

    // |
    resultOfShtrih(currentNode, iterationNumber){
        /*X  Y  F
          0  0  1
          0  1  1
          1  0  1
          1  1  0
           */

        let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
        let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

        if(X === 0 & Y === 0) return 1;
        if(X === 0 & Y === 1) return 1;
        if(X === 1 & Y === 0) return 1;
        if(X === 1 & Y === 1) return 0;
    }

    // <->
    resultOfEkviv(currentNode, iterationNumber){
        /*X  Y  F
          0  0  1
          0  1  0
          1  0  0
          1  1  1
           */

        let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
        let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

        if(X === 0 & Y === 0) return 1;
        if(X === 0 & Y === 1) return 0;
        if(X === 1 & Y === 0) return 0;
        if(X === 1 & Y === 1) return 1;
    }

    // |>
    resultOfPirsArrow(currentNode, iterationNumber){
        /*X  Y  F
          0  0  1
          0  1  0
          1  0  0
          1  1  0
           */

        let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
        let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

        if(X === 0 & Y === 0) return 1;
        if(X === 0 & Y === 1) return 0;
        if(X === 1 & Y === 0) return 0;
        if(X === 1 & Y === 1) return 0;
    }

    // *
    resultOfConuction(currentNode, iterationNumber){
        /*X  Y  F
          0  0  0
          0  1  0
          1  0  0
          1  1  1
           */

        let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
        let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

        if(X === 0 & Y === 0) return 0;
        if(X === 0 & Y === 1) return 0;
        if(X === 1 & Y === 0) return 0;
        if(X === 1 & Y === 1) return 1;
    }

    // +
    resultOfDisunction(currentNode, iterationNumber){
        /*X  Y  F
          0  0  0
          0  1  1
          1  0  1
          1  1  1
           */

        let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
        let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

        if(X === 0 & Y === 0) return 0;
        if(X === 0 & Y === 1) return 1;
        if(X === 1 & Y === 0) return 1;
        if(X === 1 & Y === 1) return 1;
    }

    // NOT
    resultOfNOT(currentNode, iterationNumber){
        /*X  F  
          0  1
          1  0
           */

        let X = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;

        if(X === 0) return 1;
        if(X === 1) return 0;
    }

}

 // defer в html для асинхронной обработки

function print(finalString){
    var elem = document.getElementById('final');
    elem.innerHTML = finalString;
}

var numVariables = null;
var numberOperations = null;

function setNumberVariables(number){
    numVariables = number;
}

function setNumberOperations(number){
    numberOperations = number;
}

class Task{
    constructor(Tree){
        this.Tree = Tree;
        this.task = document.createElement('div');
        this.task.className = "gotTasks";
        this.button = document.createElement('button');
        this.button.innerHTML = "Проверить";
        this.button.addEventListener('click', () => this.compareResult());
        this.userAnswer = null;
        this.right = document.createElement('p');
        this.right.innerHTML = "Правильно";
        this.right.style = "color: green";
        this.wrong = document.createElement('p');
        this.wrong.innerHTML = "Неправильно";
        this.wrong.style = "color: red";
    }
}


class TaskBoolTable extends Task{
    constructor(Tree){
        super(Tree);
    }

    getTask(){
        this.task.innerHTML += "<p>Заполните таблицу истинности:</p>"

        this.task.innerHTML += "<p>" + usedVariables.slice(0,this.Tree.variables).join(' ') + " " + "|" + " " + "F" + "</p>";
        let iterations = 0;
        
            if(this.Tree.variables === 3)
            while(iterations < 8)
            {
                this.task.innerHTML += "<p>" + this.Tree.varTable["A"][iterations] + " " + this.Tree.varTable["B"][iterations] + " " + this.Tree.varTable["C"][iterations] + " " + "|" + " " + "<input class='boolTable' type='text'>" + "</p>";
                iterations++;
            }
    
            if(this.Tree.variables === 4) // сделать для 4 переменных
            while(iterations < 16)
            {
                this.task.innerHTML += "<p>" + this.Tree.varTable["A"][iterations] + " " + this.Tree.varTable["B"][iterations] + " " + this.Tree.varTable["C"][iterations] + " " + this.Tree.varTable["D"][iterations] + " " + "|" + " " + "<input class='boolTable' type='text'>" + "</p>";
                iterations++;
            }

            this.task.append(this.button);
            return this.task;
    }

    trueResult(boolTable){
        let iterations = 0;
        boolTable.innerHTML += "<p>" + usedVariables.slice(0,this.Tree.variables).join(' ') + " " + "|" + " " + "F" + "</p>";
        if(this.Tree.variables === 3)
        while(iterations < 8)
        {
            boolTable.innerHTML += "<p>" + this.Tree.varTable["A"][iterations] + " " + this.Tree.varTable["B"][iterations] + " " + this.Tree.varTable["C"][iterations] + " " + "|" + " " + this.Tree.finalResult[iterations];
            iterations++;
        }

        if(this.Tree.variables === 4)
        while(iterations < 16)
        {
            boolTable.innerHTML += "<p>" + this.Tree.varTable["A"][iterations] + " " + this.Tree.varTable["B"][iterations] + " " + this.Tree.varTable["C"][iterations] + " " + this.Tree.varTable["D"][iterations] + " " + "|" + " " + this.Tree.finalResult[iterations];
            iterations++;
        }
    }

    compareResult(){
        let userAnswer = document.getElementsByClassName("boolTable");
        console.log(userAnswer);
        let comparedResult = [];
        for(let i = 0; i< userAnswer.length; i++){
            comparedResult.push(parseInt(userAnswer[i].value));
        }

        let key = true;

        for(let i = 0; i< userAnswer.length; i++){
            if(comparedResult[i] != this.Tree.finalResult[i])
            {
                key = false;
                break;
            }
        }

        this.userAnswer = comparedResult;

        console.log(comparedResult);

        if(this.task.lastChild.previousSibling === this.right || this.task.lastChild.previousSibling === this.wrong)
        {
            this.task.lastChild.previousSibling.remove();
            this.task.lastChild.remove();
        }

        if(key)
        {
            this.task.append(this.right);
        } 
        else {
            this.task.append(this.wrong);
        }

        let table = document.createElement('details');
        table.innerHTML = "<summary style='color: blue'>Правильный ответ</summary>";
        this.trueResult(table);

        if(this.task.lastChild != table)
        this.task.append(table);
    }
}

class TaskSDNF extends Task{
    constructor(Tree){
        super(Tree);
    }

    getTask(){
        this.task.innerHTML += "<p>Напишите СДНФ функции:</p>";
        this.task.innerHTML += "<p>СДНФ: <textarea class='SDNF'></textarea></p>";
        let example = document.createElement('div');
        example.innerHTML += "<p>Пример записи СДНФ: NOT A*B + C*NOT D</p>";
        this.task.append(example);
        this.task.append(this.button);
        console.log(this.Tree.SDNF);
        return this.task;
    }

    parse(string){
        let answer = string.split(' + ');
        console.log(answer);
        
        return answer;
    }

    compareResult(){
        let userAnswer = document.getElementsByClassName('SDNF')[0].value;
        console.log(userAnswer);
        userAnswer = this.parse(userAnswer);
        let counter = 0;

        for(let item in userAnswer)
        {
            for(let j in this.Tree.SDNF)
            {
                if (item === j)
                counter += 1;
            }
        }

        if(this.task.lastChild.previousSibling === this.right || this.task.lastChild.previousSibling === this.wrong)
        {
            this.task.lastChild.previousSibling.remove();
            this.task.lastChild.remove();
        }

        if(counter === this.Tree.SDNF.length)
        this.task.append(this.right);
        else
        this.task.append(this.wrong);

        let table = document.createElement('details');
        table.innerHTML = "<summary style='color: blue'>Правильный ответ</summary>";
        table.innerHTML += '<p>' + this.Tree.SDNF.join(' + ') + '</p>';

        if(this.task.lastChild != table)
        this.task.append(table);
    }
}

class TaskSKNF extends Task{
    constructor(Tree){
        super(Tree);
    }

    getTask(){
        this.task.innerHTML += "<p>Напишите СКНФ функции:</p>";
        this.task.innerHTML += "<p>СКНФ: <textarea class='SKNF'></textarea></p>";
        let example = document.createElement('div');
        example.innerHTML += "<p>Пример записи СКНФ: (NOT A+B) * (C+NOT D)</p>";
        this.task.append(example);
        this.task.append(this.button);
        console.log(this.Tree.SKNF);
        return this.task;
    }

    parse(string){
        let answer = string.split(' * ');
        console.log(answer);
        return answer;
    }

    compareResult(){
        let userAnswer = document.getElementsByClassName('SKNF')[0].value;
        console.log(userAnswer);
        userAnswer = this.parse(userAnswer);
        let counter = 0;

        for(let item in userAnswer)
        {
            for(let j in this.Tree.SKNF)
            {
                if (item === j)
                counter += 1;
            }
        }

        if(this.task.lastChild.previousSibling === this.right || this.task.lastChild.previousSibling === this.wrong)
        {
            this.task.lastChild.previousSibling.remove();
            this.task.lastChild.remove();
        }
        

        if(counter === this.Tree.SKNF.length)
        this.task.append(this.right);
        else
        this.task.append(this.wrong);

        let table = document.createElement('details');
        table.innerHTML = "<summary style='color: blue'>Правильный ответ</summary>";
        table.innerHTML += '<p>' + this.Tree.SKNF.join(' * ') + '</p>';

        if(this.task.lastChild != table)
        this.task.append(table);
    }
}

function newTree(){ //umberOperators,

    console.log(numVariables);
    console.log(numberOperations);
    

    if(numVariables === null)
    {
        alert("Вы не выбрали количество переменных");
        return 0;
    }

    if(numberOperations === null)
    {
        alert("Вы не выбрали количество операций");
        return 0;
    }

    const myTree = new BooleanTree(); // говнокод, надо сделать через document
    myTree.createTree(numVariables, numberOperations); // исправить


    let tasks = document.getElementsByClassName("tasks");
    let chosenTasks = document.getElementById("tasks");
    chosenTasks.innerHTML = null;

    [...tasks].forEach(e => {
        if(e.checked === true)
        switch(e.value){
            case "boolTable":
                let boolTable = new TaskBoolTable(myTree);
                chosenTasks.append(boolTable.getTask());
                break;
            case "SDNF":
                let SDNF = new TaskSDNF(myTree);
                chosenTasks.append(SDNF.getTask());
                break;
            case "SKNF":
                let SKNF = new TaskSKNF(myTree);
                chosenTasks.append(SKNF.getTask());
                break;
            default:
                0;
        }
    })

    // myTree.resultOfFunction(myTree);
    // let SDNF = document.getElementById('SDNF');
    // SDNF.innerHTML = myTree.toSDNF();
    // let SKNF = document.getElementById('SKNF');
    // SKNF.innerHTML = myTree.toSKNF();

    // console.log(myTree);
    // console.log(myTree.getString());
    print(myTree.getString())


}


