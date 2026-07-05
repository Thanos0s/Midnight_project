// test.js


console.log("Starting Auction Test...");


const user1 = "0x123";
const user2 = "0x456";


const bid1 = 100;
const bid2 = 200;

let highestBid = 0;
let winner = null;

// simulate bidding
function submitBid(user, bid) {
    console.log(`${user} is bidding ${bid}`);

    if (bid > highestBid) {
        highestBid = bid;
        winner = user;
    }
}

// simulate auction
submitBid(user1, bid1);
submitBid(user2, bid2);

console.log("Auction closed");
console.log("Winner:", winner);
console.log("Highest Bid:", highestBid);
