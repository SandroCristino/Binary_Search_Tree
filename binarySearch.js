// Firstly, we have to sort the array
function mergeSort(array) {
    if (array.length <= 1) return array;

    const leftHalf = array.slice(0, array.length / 2);
    const rightHalf = array.slice(array.length / 2);
  
    const sortedLeft = mergeSort(leftHalf);
    const sortedRight = mergeSort(rightHalf);
  
    return merge(sortedLeft,sortedRight)
}
  
function merge(leftArray, rightArray) {
    const sortedArray = [];
    while (leftArray.length && rightArray.length) {
        leftArray[0] < rightArray[0] 
        ? sortedArray.push(leftArray.shift()) 
        : leftArray[0] == rightArray[0]
        ? leftArray.shift()
        : sortedArray.push(rightArray.shift());
    }
    return sortedArray.concat(leftArray, rightArray)
}

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        mergeSort(array);
        if (array.length == 0) return null;
        const mid = Math.floor(array.length / 2);
        const root = new Node(array[mid]);

        root.left = this.buildTree(array.slice(0, mid));
        root.right = this.buildTree(array.slice(mid + 1))

        return root;
    }

    // Visualize tree structure
    prettyPrint (node = this.root, prefix = '', isLeft = true) {
        if (node === null) {
           return;
        }
        if (node.right !== null) {
          this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
        if (node.left !== null) {
        this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
    }

    find(value) {
        let current = this.root;
        while (current !== null) {
          if (current.value === value) {
            return current;
          } else if (value < current.value) {
            current = current.left;
          } else {
            current = current.right;
          }
        }
        return null;
    }

    insertIterative(value) {
        const newNode = new Node(value);

        // If root is empty
        if (this.root == null) return this.root = newNode;

        // Loop while similar value is found 
        let current = this.root;
        while(true) {
            if (value < current.value) {
                if (current.left == null) {
                    current.left = newNode;
                    break;
                }
                current = current.left
            } else {
                if (current.right == null) {
                    current.right = newNode;
                    break;
                }
                current = current.right;
            }
        }
    }

    insertRecursive(value, current = this.root) {
        const newNode = new Node(value);
        if (this.root == null) return this.root = newNode;

        // Base case 
        if (current == null) return newNode;

        // Recursive case
        if (value < current.value) return current.left = this.insertRecursive(value, current.left) 
        else current.right = this.insertRecursive(value, current.right)
        return current;
    }

    remove(value, current = this.root) {
        // Base case: If the current node is null, return null
        if (current == null) return null;
    
        // Recursive case: Traverse down the tree til the node with the value to remove is found
        if (value < current.value) {
            current.left = this.remove(value, current.left);
            return current;
        } else if (value > current.value) {
            current.right = this.remove(value, current.right);
            return current;
        } 
    
        // If the node to remove has been found, check its children
        if (current.left == null && current.right == null) {
            // Case 1: Node to remove has no children
            return null;
        } else if (current.left == null) {
            // Case 2: Node to remove has one child (right child)
            return current.right;
        } else if (current.right == null) {
            // Case 2: Node to remove has one child (left child)
            return current.left;
        } else {
            // Case 3: Node to remove has two children
            // Find the smallest value in the right subtree
            let minNode = current.right;
            while (minNode.left !== null) {
                minNode = minNode.left;
            }
            // Replace the node to remove with the smallest node in the right subtree
            current.value = minNode.value;
            // Remove the smallest node in the right subtree
            current.right = this.remove(minNode.value, current.right);
            return current;
        }
    }

    levelOrderIterativ(func) {
        const queue = [this.root];
        
        while (queue.length > 0) {
            const current = queue.shift();
            if (current != null) {
                func(current)
                queue.push(current.left);
                queue.push(current.right);
            }
        }
    } 

    levelOrderRecursive(func, queue = [this.root]) {
        if (!queue.length) return;

        const current = queue.shift();
        func(current);
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);

        this.levelOrderRecursive(func, queue)
    }

    // Inorder > first the left side, then root, then right 
    inorder(func, node = this.root) {
        if (node == null) return

        this.inorder(node.left, func);
        func(node.value);
        this.inorder(node.right, func);
    }

    // Preorder > first the left side, then right, then root
    preorder(func, node = this.root) {
        if (node == null) return

        func(node.value);
        this.preorder(node.left, func);
        this.preorder(node.right, func);
        
    } 

    // Postorder > Left, right, root policy > while left true, left, then right, then root
    postorder(func, node = this.root) {
        if (node == null) return

        if (node.left) this.postorder(node.left, func);
        if (node.right) this.postorder(node.right, func);
        func(node.value)
    }

    // Defined a number from a given node to a leaf node(= node without children)
    height(node, counter = false) {
        if (counter == false) {
            node = this.find(node.value);
            counter = true;
        }
        if (node == null) return -1;
        else {
            const leftHeight = this.height(node.left, counter);
            const rightHeight = this.height(node.right, counter);
            return 1 + Math.max(leftHeight, rightHeight);
        }
    }

    // Defined a number from a given node to the root
    depth(node) {
        if (this.find(node.value) == null) return null;

        let current = this.root;
        let depth = 0;
        
        while (node.value != current.value || current == null) {
            if (node.value < current.value) current = current.left;
            else current = current.right;
            depth++;
        }

        return depth;
    }

    isBalanced(current = this.root) {
        if (current == null) return 0;

        const leftSubtreeHeight = this.isBalanced(current.left);
        if (leftSubtreeHeight == -1) return -1;

        const rightSubtreeHeight = this.isBalanced(current.right);
        if (rightSubtreeHeight == -1) return -1;

        if (Math.abs(leftSubtreeHeight - rightSubtreeHeight) > 1) return -1;

        return Math.max(leftSubtreeHeight, rightSubtreeHeight) + 1
    }
    
    rebalance() {
        const a = []
        this.levelOrderIterativ(item => {
            a.push(item.value)
        });
        this.root = this.buildTree(a);
    }
}

const array = [1,2,4,5,6,7,8,9]
const tree = new Tree(array);
tree.prettyPrint();


function driverScript() {
    const randomNumbers = [1,2,3,232,32,43,54,12,321,160,53,83,213];
    const newTree = new Tree(randomNumbers);
    console.log(newTree.isBalanced());
    newTree.insertRecursive(123);
    newTree.insertRecursive(673);
    newTree.insertRecursive(543);
    newTree.insertRecursive(43);
    console.log(newTree.isBalanced());
    newTree.rebalance();
    console.log(newTree.isBalanced());

}

driverScript();


