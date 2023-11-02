const operators = ["*", "+", "XOR", "<->", "|", "->"]; // добавить NOT обратно
const variables = ["A", "B", "C", "D"];
const symbols = operators + variables;

class Node{
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BooleanTree{
    constructor(){
        this.root = null;
        this.operations = null;
    }


    createTree(numOperators){
        this.operations = numOperators;
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

        for(let i = 0; i < queue.length; i++)
        {
            queue[i].value = variables[Math.floor(Math.random()*variables.length)];
        }
    }

    setBrackets(currentString,currentNode){
        let openBracket = new Node("(");
        let closeBracket = new Node(")");
        let currentIndex = currentString.indexOf(currentNode)

        if(operators.includes(currentNode.value))
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

        return currentString;
    }

    getString(){
        if(this.root === null) return false
        let currentString = [];

        let finalString = []
        let currentNode = this.root;

        currentString.push(currentNode)
        currentString.unshift(currentNode.left);
        currentString.push(currentNode.right);

        currentString = this.setBrackets(currentString,currentNode.left);
        currentString = this.setBrackets(currentString,currentNode.right);

        console.log(currentString);

        for(let i = 0; i < currentString.length; i++)
            finalString[i] = currentString[i].value;

        return finalString.join(' ');
    }

}

const myTree = new BooleanTree();
myTree.createTree(7);
console.log(myTree);
console.log(myTree.getString())

