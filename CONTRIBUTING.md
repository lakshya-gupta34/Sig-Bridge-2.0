# Contributing to SignBridge

Thank you for your interest in contributing to **SignBridge**! We are building an inclusive, open-source bridge for India's 18+ million Deaf & Hard-of-Hearing community.

Whether you are a Deaf native signer, an ISLRTC-certified interpreter, a computer vision researcher, or a web developer, your contributions are deeply valued.

---

## How You Can Contribute

### 1. Contributing ISL Sign Data (Signers & Interpreters)
We prioritize authentic vocabulary aligned with **ISLRTC (Indian Sign Language Research and Training Centre)** standards.
- To record a new sign, use the utility script:
  ```bash
  python backend/dataset_collector.py --sign <sign_name> --samples 30
  ```
- Document any known regional dialect variations (e.g., North India vs. South India).
- Include anatomical descriptions (handshape, orientation, location, movement).

### 2. Enhancing Linguistic Rules (Linguists)
- Our grammar transformer is defined in `js/isl_grammar.js` and `backend/isl_grammar_engine.py`.
- If you notice edge cases in complex compound sentences, open an issue or submit a pull request with unit test cases added to `tests/test_isl_grammar.js`.

### 3. Improving Computer Vision & Gesture Models
- Models should maintain scale and translation invariance.
- Ensure any proposed model runs efficiently at $\ge 30\text{ fps}$ on standard laptops without requiring high-end dedicated GPUs.

---

## Development Workflow

1. Fork the repository and clone your branch:
   ```bash
   git clone https://github.com/your-username/signbridge.git
   cd signbridge
   ```
2. Start the local server:
   ```bash
   npm start
   # or: node server.js
   ```
3. Run test suites:
   ```bash
   npm test
   python tests/test_backend.py
   ```
4. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "feat(corpus): add regional variations for medical emergency signs"
   ```
5. Submit a Pull Request.

---

## Community Guidelines
- Always center the lived experience and communication preferences of Deaf signers.
- Strive for W3C WCAG 2.1 AAA accessibility in all UI contributions.
