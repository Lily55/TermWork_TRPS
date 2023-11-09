const operators = ["*", "+", "<->", "|", "->", "NOT", "XOR"]; // 
// const neededOperators = ["*", "+"];
const usedVariables = ["A", "B", "C", "D"];
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
        this.operations = null;
        this.variables = null;
        
    }
}

// class varTable{
//     constructor(){

//     }
// }

class BooleanTree extends Tree{
    constructor(){
        super();
        this.varTable = null;
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

}

var elem = document.getElementById('final'); // defer в html для асинхронной обработки

function print(finalString){
    elem.innerHTML = finalString;
}



function newTree(numberOperations){
    let numVariables = document.getElementsByName('variable')
    const myTree = new BooleanTree(); // говнокод, надо сделать через document
    myTree.createTree(3, numberOperations); // исправить

    let newTree = new BooleanTree();
    newTree.numVariables = 3;
    newTree.setVariables(3);
    newTree.root = new Node("XOR");
    newTree.root.left = new Node("A");
    newTree.root.right = new Node("B");

    for (let i=0; i < 8; i++)
    console.log(newTree.resultOfXOR(newTree.root,i));

    // console.log(Object.keys(myTree.varTable));
    // console.log(Object.values(myTree.varTable));
    // console.log(myTree.varTable["A"][7]);

    console.log(myTree);
    console.log(myTree.getString());
    print(myTree.getString())


}


