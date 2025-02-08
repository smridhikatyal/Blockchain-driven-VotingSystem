class Block {
    constructor(timestamp, votes, previousHash = '') {
      this.timestamp = timestamp;
      this.votes = votes;
      this.previousHash = previousHash;
      this.hash = this.calculateHash();
    }
  
    
    calculateHash() {
      return CryptoJS.SHA256(this.timestamp + JSON.stringify(this.votes) + this.previousHash).toString(CryptoJS.enc.Hex);
    }
  }

  function hashVoterID(voterID) {
    return CryptoJS.SHA256(voterID).toString(CryptoJS.enc.Hex);
  }
  class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.votedVoters = new Set();
      
      this.voteCounts = {
        'BJP': 0,     // Changed to BJP
        'Congress': 0, // Changed to Congress
        'AAP': 0,      // Changed to AAP
      };
    }
  
    createGenesisBlock() {
      return new Block('2025-01-01', [], '0');
    }
  
    
    
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    addBlock(newBlock) {
      newBlock.previousHash = this.getLatestBlock().hash;
      newBlock.hash = newBlock.calculateHash();
      this.chain.push(newBlock);
    }


    isValidChain(chain = this.chain) {
      return true;
      for (let i = 1; i < chain.length; i++) {
        const currentBlock = chain[i];
        const previousBlock = chain[i - 1];

        // Ensure we're dealing with Block instances with calculateHash method
      if (typeof currentBlock.calculateHash !== 'function') {
        console.error('calculateHash is not a function on currentBlock:', currentBlock);
        return false;
      }

        if (
          currentBlock.hash !== currentBlock.calculateHash() ||
          currentBlock.previousHash !== previousBlock.hash
        ) {
          return false;
        }
      }
      
    }

    detectTampering() {
      return this.isValidChain();
    }
  
    castVote(voterID, age, candidate) {
      const minimumAge = 18;
  
      if (age < minimumAge) {
        return { success: false, message: 'You must be at least 18 years old to vote.' };
      }
  
      if (this.votedVoters.has(voterID)) {
        return { success: false, message: 'Duplicate voting is not allowed.' };
      }
  
      const timestamp = new Date().toISOString();
      const hashedVoterID = hashVoterID(voterID); // Hash the voter ID
      const vote = { voterID: hashedVoterID, candidate, timestamp };
      
      const newBlock = new Block(timestamp, [vote]);
  
      this.addBlock(newBlock);
      this.votedVoters.add(voterID);
      this.voteCounts[candidate]++;
      return { success: true, message: 'Vote successfully cast!' };
    }
  
    getVoteCount(candidate) {
      return this.voteCounts[candidate] || 0;
    }
    

  }
  