const operators = ["*", "+", "XOR", "<->", "|", "->", "NOT"];
const variables = ["A", "B", "C", "D"];
const symbols = operators + variables;

class Node{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}


let inputStack = ["A", "B", "C", "*", "+", "D", "XOR"];

class BooleanTree{
    constructor(){
        this.root = null;
    }

    // checkOperator(value){
    //     for(let i = 0; i < operators.length; i++)
    //     if (value == operators[i]) return true;
    // }


    // createTree(inputLine){
    //     let stack = [];

    //     for(let i = 0; i < inputLine.length; i++)
    //     {
    //         if(!this.checkOperator(inputLine[i]))
    //         {
    //             let newLeaf = new Node(inputLine[i]);
    //             stack.push(newLeaf);
    //         }
    //         else{
    //             let newRoot = new Node(inputLine[i]);
    //             newRoot.right = stack.pop();
    //             newRoot.left = stack.pop();
    //             stack.push(newRoot);
    //             this.root = newRoot;
    //         }
    //     }
    // }

    createTree(numOperators){
        let queue = [];
        let newNode = new Node(operators[Math.floor(Math.random() * operators.length)]);
        numOperators--;
        this.root = newNode;
        newNode.left = new Node(null);
        newNode.right = new Node(null);
        queue.push(newNode.left, newNode.right);

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

        for(let i = 0; i< 3; i++)
        {
            queue[i].value = variables[Math.floor(Math.random()*variables.length)];
        }
    }

}

const myTree = new BooleanTree();
myTree.createTree(7);
console.log(myTree);

