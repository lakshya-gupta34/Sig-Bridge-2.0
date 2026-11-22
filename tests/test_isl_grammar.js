/**
 * SignBridge - Grammar Engine Unit Tests
 * Run with: node tests/test_isl_grammar.js
 */

const { ISL_CORPUS, ISL_BY_ID } = require('../js/isl_corpus.js');
const { ISLGrammarEngine } = require('../js/isl_grammar.js');

const engine = new ISLGrammarEngine();
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log('Running SignBridge ISL Grammar & Corpus Test Suite');
console.log('========================================================\n');

// 1. Corpus validation
console.log('--- 1. ISL Corpus Integrity ---');
assert(ISL_CORPUS.length >= 15, `ISL Corpus loaded with ${ISL_CORPUS.length} signs (expected >= 15)`);
assert(ISL_BY_ID['namaste'] !== undefined, 'Namaste sign exists in corpus');
assert(ISL_BY_ID['dhanyavaad'] !== undefined, 'Dhanyavaad (Thank you) exists in corpus');
assert(ISL_BY_ID['hospital'] !== undefined, 'Hospital sign exists in corpus');
assert(ISL_BY_ID['help'] !== undefined, 'Help sign exists in corpus');

// 2. English SVO to ISL SOV / Question-end Transformation
console.log('\n--- 2. English to ISL Translation ---');
const res1 = engine.translateTextToISL("Where is the hospital?");
console.log('Input: "Where is the hospital?"');
console.log('Output Gloss:', res1.glossTokens.join(' '));
assert(
  res1.glossTokens.includes('HOSPITAL') && res1.glossTokens[res1.glossTokens.length - 1] === 'WHERE',
  'Question word "WHERE" properly shifted to end of ISL sequence and copula "is/the" removed'
);

const res2 = engine.translateTextToISL("Tomorrow I will visit the doctor");
console.log('Input: "Tomorrow I will visit the doctor"');
console.log('Output Gloss:', res2.glossTokens.join(' '));
assert(
  res2.glossTokens[0] === 'TOMORROW',
  'Temporal marker "TOMORROW" pulled to start of ISL sentence'
);

// 3. Hindi Text to ISL Translation
console.log('\n--- 3. Hindi to ISL Translation ---');
const res3 = engine.translateTextToISL("मुझे पानी चाहिए");
console.log('Input: "मुझे पानी चाहिए"');
console.log('Output Gloss:', res3.glossTokens.join(' '));
assert(
  res3.glossTokens.includes('ME') && res3.glossTokens.includes('WATER'),
  'Hindi "मुझे पानी" successfully mapped to ISL [ME WATER]'
);

const res4 = engine.translateTextToISL("अस्पताल कहाँ है?");
console.log('Input: "अस्पताल कहाँ है?"');
console.log('Output Gloss:', res4.glossTokens.join(' '));
assert(
  res4.glossTokens.includes('HOSPITAL') && res4.glossTokens[res4.glossTokens.length - 1] === 'WHERE',
  'Hindi question "अस्पताल कहाँ" mapped with WHERE at end'
);

// 4. Reverse Translation (ISL -> Text)
console.log('\n--- 4. ISL Sign Sequence to Bilingual Text ---');
const rev1 = engine.translateISLToText(['hospital', 'where']);
console.log('ISL: [HOSPITAL, WHERE]');
console.log('English:', rev1.english);
console.log('Hindi:', rev1.hindi);
assert(rev1.english.includes('hospital') && rev1.hindi.includes('अस्पताल'), 'Reverse translation generates natural English & Hindi');

console.log('\n========================================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('========================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All grammar & corpus tests passed successfully!\n');
}
