let signs = ["xor", "or", "&", "not", "<->"]

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
    }

    checkSigns(value){
        for(let sign of signs){
        if (value == sign)
            return true;
        }
        return false;
    }

    add(value, numOperands, numOperations){
        const newNode = new Node(value);
        if(!this.root){
            this.root = newNode;
            return;
        }

        let currentNode = this.root;
        while(currentNode)
        {
            if(this.checkSigns(newNode.value))
            {
                if(!currentNode.left){
                    currentNode.left = newNode;
                    return;
                }

                currentNode = currentNode.left;
            }
            else{
                if(!currentNode.right){
                    currentNode.right = newNode;
                    return;
                }

                currentNode = currentNode.right;
            }
        }
    }

    printLeft(node){
        let currentNode = node;
        if(currentNode)
        {
            this.printLeft(currentNode.left)
            console.log(currentNode.value)
        }
    }

    printRight(node){
        let currentNode = node;
        if(currentNode)
        {
            this.printRight(currentNode.right)
            console.log(currentNode.value)
        }
    }

    printTree(){

    }
}

const myTree = new BooleanTree();
myTree.add(5);
myTree.add("<->");
myTree.add(6);
myTree.add("xor");
myTree.add(90);

console.log(myTree);
myTree.printLeft(myTree.root);
myTree.printRight(myTree.root);