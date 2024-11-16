import SHA256 from 'crypto-js/sha256.js';

class CryptoBlock {
    constructor(index, timestamp, data, precedingHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    computeHash() {
        return SHA256(
            this.index +
            this.precedingHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    proofOfWork(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++; 
            this.hash = this.computeHash();
        }
    }
}

class CryptoBlockChain {
    constructor(difficulty = 2) {
        this.chain = [this.createGenesisBlock()]; 
        this.difficulty = difficulty;
    }

  
    createGenesisBlock() {
        return new CryptoBlock(0, "16/11/2024", "Initial Block in the Chain", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.precedingHash = this.getLatestBlock().hash; 
        newBlock.proofOfWork(this.difficulty);
        this.chain.push(newBlock); 
    }


    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const precedingBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }

            if (currentBlock.precedingHash !== precedingBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let coin = new CryptoBlockChain(4); 
console.log("Mining block 1...");
coin.addBlock(new CryptoBlock(1, "16/11/2024", { sender: "dean", recipient: "almas", amount: 100 }));

console.log("Mining block 2...");
coin.addBlock(new CryptoBlock(2, "16/11/2024", { sender: "almas", recipient: "dean", amount: 50 }));

console.log(JSON.stringify(coin, null, 4));

console.log("Blockchain validity:", coin.isChainValid());
