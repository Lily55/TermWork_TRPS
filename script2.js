const operators = [ "XOR"]; // "*", "+", "<->", "|", "->", "NOT",
const neededOperators = ["*", "+"];
const variables = ["A", "B", "C", "D"];
const symbols = operators + variables;

class Node{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// class LittleTree extends Node{
//     constructor(){
//         this.root = null;
//         this.left = null;
//         this.right = null;
//     }
// }


class Tree{

    constructor(){
        this.root = null;
        this.operations = null;
    }
}


class BooleanTree extends Tree{
    constructor(){
        super();
    }

    //Функция собирает дерево
    createTree(numOperators){
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
            queue[i].value = variables[Math.floor(Math.random()*variables.length)];
        }
    }

    //Функция ставит скобки
    setBrackets(currentString,currentNode){
        let openBracket = new Node("(");
        let closeBracket = new Node(")");
        let currentIndex = currentString.indexOf(currentNode)

        if(neededOperators.includes(currentNode.value) && currentNode.value != "NOT")
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

    // // функция преобразует базис Жегалкина в булевую алгебру
    // fromZhegToBool(){
    //     if(this.root === null) return false
    // }

    // // Раскрытие операций (Стрелка Пирса, штрих Шеффера и тд)
    fromXORToBool(oldNode){
        // A XOR B = NOT A * B + A * NOT B = (NOT A + NOT B) * (A + B)

        let newRoot = new Node("+");

        newRoot.left = new Node("*");
        newRoot.right = new Node("*");

        newRoot.left.left = new Node("NOT");
        newRoot.left.left.right = structuredClone(oldNode.left);
        newRoot.left.right = structuredClone(oldNode.right);

        // newRoot.left.left = structuredClone(oldNode.left);
        // newRoot.left.right = structuredClone(oldNode.right);

        newRoot.right.right = new Node("NOT");
        newRoot.right.right.right = structuredClone(oldNode.right);
        newRoot.right.left = structuredClone(oldNode.left);

        return newRoot;
    }

    printTree(currentNode){
        if(currentNode.left != null && currentNode.right != null)
        {
            //console.log(currentNode.value)
            if(currentNode.left.value === "XOR")
            currentNode.left = this.fromXORToBool(currentNode.left)
            this.printTree(currentNode.left)

            if(currentNode.right.value === "XOR")
            currentNode.right = this.fromXORToBool(currentNode.right)            
            this.printTree(currentNode.right)
        }
    }

    toDNF(){


        let currentNode = this.root

        this.printTree(currentNode)

        if(this.root.value === "XOR")
        this.root = this.fromXORToBool(this.root)


    }

}

var elem = document.getElementById('final'); // defer в html для асинхронной обработки

function print(finalString){
    elem.innerHTML = finalString;
}

// function treeFromTrees(){
//     const ourTree = new Node("+");

//     ourTree.left = new BooleanTree;
//     ourTree.right = new BooleanTree;

//     ourTree.left.createTree(2);
//     ourTree.right.createTree(2);

//     const leftString = ourTree.left.getString();
//     const rightString = ourTree.right.getString();

//     const finalString = "(" + " " + leftString + " " + ")" + " " + ourTree.value + " " + "(" + " " + rightString + " " + ")"; 

//     return finalString;
    
// }

function newTree(number){
    let numVariables = document.getElementsByName('variable')
    const myTree = new BooleanTree(); // говнокод, надо сделать через document
    myTree.createTree(number); // исправить

    console.log(myTree);
    console.log(myTree.getString());

    myTree.toDNF();

    console.log(myTree);
    console.log(myTree.getString());
    // print(myTree.getString())


}


