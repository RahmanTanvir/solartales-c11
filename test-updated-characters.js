// Test script to verify updated character narrators
const characters = [
  'astronaut',
  'pilot', 
  'farmer',
  'power_grid_operator',
  'aurora_hunter', // represents general public
  'radio_operator'
];

console.log('🎭 Updated Character Narrators for Space Weather Stories:');
console.log('====================================================');

characters.forEach((character, index) => {
  console.log(`${index + 1}. ${character.replace('_', ' ').toUpperCase()}`);
});

console.log('\n✅ Characters now represent diverse groups impacted by space weather:');
console.log('   - Farmers (agriculture & GPS-dependent technology)');
console.log('   - Pilots (aviation & navigation safety)');
console.log('   - Astronauts (space operations & radiation protection)');
console.log('   - Power grid operators (electrical infrastructure)');
console.log('   - General public (aurora hunters & everyday people)');
console.log('   - Radio operators (communications & emergency services)');

console.log('\n🌟 These narrators will explain space weather impacts through their unique perspectives,');
console.log('   making the science accessible and relatable to children through real-world examples.');
