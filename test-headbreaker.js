// Quick test script to verify headbreaker is working
const headbreaker = require('headbreaker');

console.log('Headbreaker library loaded successfully!');
console.log('Available exports:', Object.keys(headbreaker));

// Test if Canvas constructor is available
if (headbreaker.Canvas) {
  console.log('✅ Canvas constructor is available');
} else {
  console.log('❌ Canvas constructor is NOT available');
}

// Test if other key functions are available
const expectedFunctions = ['Canvas', 'painters', 'Painter', 'Piece', 'Structure'];
expectedFunctions.forEach(func => {
  if (headbreaker[func]) {
    console.log(`✅ ${func} is available`);
  } else {
    console.log(`❌ ${func} is NOT available`);
  }
});

console.log('\nHeadbreaker library test complete!');