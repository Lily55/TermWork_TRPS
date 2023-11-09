function toDNF(){


    let currentNode = this.root

    this.printTree(currentNode)

    if(this.root.value === "XOR")
    this.root = this.fromXORToBool(this.root)


}

function     printTree(currentNode){
    if(currentNode.left != null && currentNode.right != null)
    {
        //console.log(currentNode.value)
        if(currentNode.left.value === "XOR")
        currentNode.left = this.fromXORToBool(currentNode.left)
        

        if(currentNode.right.value === "XOR")
        currentNode.right = this.fromXORToBool(currentNode.right)  

        this.printTree(currentNode.left)          
        this.printTree(currentNode.right)
    }
}

    // // Раскрытие операций (Стрелка Пирса, штрих Шеффера и тд)
function fromXORToBool(oldNode){
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