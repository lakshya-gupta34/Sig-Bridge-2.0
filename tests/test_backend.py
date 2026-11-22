"""
SignBridge - Python Backend Test Suite
Tests:
- ISL Grammar Engine (SOV, Time-first, Question movement, Hindi/English parsing)
- Landmark Normalization & Cosine Classifier
"""

import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from isl_grammar_engine import ISLGrammarProcessor
from landmark_classifier import ISLLandmarkClassifier, REFERENCE_TEMPLATES

passed = 0
failed = 0


def assert_test(condition: bool, message: str):
    global passed, failed
    if condition:
        print(f"  [PASS] {message}")
        passed += 1
    else:
        print(f"  [FAIL] {message}")
        failed += 1


def run_tests():
    print("========================================================")
    print("Running SignBridge Python Backend Test Suite")
    print("========================================================\n")

    # 1. Grammar Engine Tests (English)
    print("--- 1. English to ISL SOV Parsing ---")
    res1 = ISLGrammarProcessor.text_to_isl("Where is the hospital?")
    print(f"Input: 'Where is the hospital?' -> Glosses: {res1['gloss_tokens']}")
    assert_test(
        res1['gloss_tokens'] == ['HOSPITAL', 'WHERE'],
        "English SVO question correctly parsed to ISL [HOSPITAL, WHERE] with copula dropped"
    )

    res2 = ISLGrammarProcessor.text_to_isl("Tomorrow I will visit the doctor")
    print(f"Input: 'Tomorrow I will visit the doctor' -> Glosses: {res2['gloss_tokens']}")
    assert_test(
        res2['gloss_tokens'][0] == 'TOMORROW',
        "Temporal marker 'TOMORROW' anchored at sentence start"
    )

    # 2. Grammar Engine Tests (Hindi)
    print("\n--- 2. Hindi to ISL Parsing ---")
    res3 = ISLGrammarProcessor.text_to_isl("मुझे पानी चाहिए")
    print(f"Input: 'मुझे पानी चाहिए' -> Glosses: {res3['gloss_tokens']}")
    assert_test(
        'ME' in res3['gloss_tokens'] and 'WATER' in res3['gloss_tokens'],
        "Hindi 'मुझे पानी' successfully translated to ISL [ME, WATER]"
    )

    # 3. Reverse Translation (ISL -> Text)
    print("\n--- 3. Reverse Translation (ISL -> English/Hindi) ---")
    rev = ISLGrammarProcessor.isl_to_text(['hospital', 'where'])
    print(f"ISL: [hospital, where] -> English: '{rev['english']}', Hindi: '{rev['hindi']}'")
    assert_test("hospital" in rev['english'].lower(), "Generated English includes 'hospital'")
    assert_test("अस्पताल" in rev['hindi'], "Generated Hindi includes 'अस्पताल'")

    # 4. Landmark Classifier Tests
    print("\n--- 4. Landmark Vector Normalization & Classifier ---")
    classifier = ISLLandmarkClassifier()

    # Test classification of perfect template
    for sign_id, ref in REFERENCE_TEMPLATES.items():
        predicted, conf = classifier.classify_frame(ref['features'])
        assert_test(
            predicted == sign_id and conf >= 90.0,
            f"Classified '{sign_id}' with {conf}% confidence"
        )

    print("\n========================================================")
    print(f"Results: {passed} passed, {failed} failed")
    print("========================================================\n")

    if failed > 0:
        sys.exit(1)
    else:
        print("All Python backend unit tests passed successfully!\n")


if __name__ == "__main__":
    run_tests()
