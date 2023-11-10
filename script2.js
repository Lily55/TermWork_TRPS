const operators = ["+","<->", "|", "->", "*", "XOR"]; // "NOT",  "<->", "|", "->", 
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

        if(this.variables === 3)
        {
            
        }

        for(let i = 0; i < queue.length; i++)
        {
            queue[i].value = usedVariables[Math.floor(Math.random()*(usedVariables.length-1))]; //переделать
        }
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
        let boolTable = document.getElementById("boolTable");
        boolTable.innerHTML += "<p>" + usedVariables.join(' ') + " " + "|" + " " + "F" + "</p>"
        let iterations = 0;
        let finalMass = [];
        let clonnedTree = structuredClone(Tree);

        if(clonnedTree.variables === 3)
        while(iterations < 8)
        {
            this.printTree(clonnedTree.root, iterations, finalMass);          
            console.log(finalMass);
            this.finalResult.push(finalMass[finalMass.length - 1]);
            console.log(this.finalResult);
            boolTable.innerHTML += "<p>" + this.varTable["A"][iterations] + " " + this.varTable["B"][iterations] + " " + this.varTable["C"][iterations] + " " + "|" + " " + finalMass.pop() + "</p>";
            iterations++;
            finalMass = [];
            clonnedTree = structuredClone(Tree);
        }

        if(clonnedTree.variables === 4) // сделать для 4 переменных
        while(iterations < 16)
        {
            this.printTree(clonnedTree.root, iterations, finalMass);
            iterations++;
            console.log(finalMass);
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

    // // NOT
    // resultOfNOT(currentNode, iterationNumber){
    //     /*X  Y  F
    //       0  0  1
    //       0  1  1
    //       1  0  0
    //       1  1  1
    //        */

    //     let X = usedVariables.includes(currentNode.left.value) ? this.varTable[currentNode.left.value][iterationNumber] : currentNode.left.value;
    //     let Y = usedVariables.includes(currentNode.right.value) ? this.varTable[currentNode.right.value][iterationNumber] : currentNode.right.value;


    //     if(X === 0 & Y === 0) return 1;
    //     if(X === 0 & Y === 1) return 1;
    //     if(X === 1 & Y === 0) return 0;
    //     if(X === 1 & Y === 1) return 1;
    // }

}

var elem = document.getElementById('final'); // defer в html для асинхронной обработки

function print(finalString){
    elem.innerHTML = finalString;
}



function newTree(numberOperations){
    let numVariables = document.getElementsByName('variable')
    const myTree = new BooleanTree(); // говнокод, надо сделать через document
    myTree.createTree(3, numberOperations); // исправить

    // let newTree = new BooleanTree();
    // newTree.numVariables = 3;
    // newTree.setVariables(3);
    // newTree.root = new Node("XOR");
    // newTree.root.left = new Node("A");
    // newTree.root.right = new Node("B");

    myTree.resultOfFunction(myTree);

    // for (let i=0; i < 8; i++)
    // console.log(newTree.resultOfShtrih(newTree.root,i));



    console.log(myTree);
    console.log(myTree.getString());
    print(myTree.getString())


}


