"""
SignBridge - Landmark Feature Extractor & ISL Gesture Classifier
Provides:
- 3D Landmark Normalization (Translation invariant relative to wrist, scale invariant to palm span)
- Feature Vector Construction (Inter-joint Euclidean distances + joint angle cosines)
- Model Inference with Temporal Smoothing
"""

import math
from typing import Dict, List, Optional, Tuple, Any

# Calibrated reference templates for key ISL signs
REFERENCE_TEMPLATES = {
    'namaste': {
        'description': 'Palms joined at chest',
        'is_two_handed': True,
        'features': [0.44, 0.65, 0.48, 0.43, 0.56, 0.65, 0.52, 0.43]
    },
    'dhanyavaad': {
        'description': 'Fingers from chin moving forward',
        'is_two_handed': False,
        'features': [0.58, 0.50, 0.55, 0.33, 0.60, 0.40]
    },
    'help': {
        'description': 'Closed fist on open palm elevating',
        'is_two_handed': True,
        'features': [0.42, 0.68, 0.49, 0.59, 0.54, 0.62, 0.51, 0.55]
    },
    'doctor': {
        'description': 'Fingers tapping opposite wrist pulse',
        'is_two_handed': True,
        'features': [0.40, 0.62, 0.46, 0.51, 0.48, 0.50, 0.43, 0.59]
    },
    'water': {
        'description': 'Cupped hand tilted towards mouth',
        'is_two_handed': False,
        'features': [0.60, 0.52, 0.52, 0.40, 0.56, 0.42]
    },
    'hospital': {
        'description': 'Cross trace on shoulder',
        'is_two_handed': True,
        'features': [0.38, 0.58, 0.45, 0.45, 0.45, 0.46, 0.41, 0.52]
    },
    'yes': {
        'description': 'Closed fist nodding',
        'is_two_handed': False,
        'features': [0.58, 0.56, 0.55, 0.47, 0.58, 0.45]
    },
    'no': {
        'description': 'Index finger wagging horizontally',
        'is_two_handed': False,
        'features': [0.58, 0.58, 0.56, 0.35, 0.55, 0.50]
    }
}


class ISLLandmarkClassifier:
    """Classifies 2D/3D hand landmark sets into Indian Sign Language signs."""

    def __init__(self):
        self.history_buffer: List[str] = []
        self.buffer_size = 5

    @staticmethod
    def normalize_landmarks(raw_landmarks: List[Dict[str, float]]) -> List[Dict[str, float]]:
        """
        Normalize landmarks:
        1. Translate wrist (landmark 0) to origin (0, 0, 0)
        2. Scale by Euclidean distance from wrist to Middle Finger MCP (landmark 9)
        """
        if not raw_landmarks:
            return []

        wrist = raw_landmarks[0]
        wx, wy = wrist.get('x', 0.0), wrist.get('y', 0.0)
        wz = wrist.get('z', 0.0)

        # Reference scale joint (index 9 or last available)
        ref_idx = 9 if len(raw_landmarks) > 9 else len(raw_landmarks) - 1
        ref_joint = raw_landmarks[ref_idx]
        rx, ry = ref_joint.get('x', 0.0), ref_joint.get('y', 0.0)
        rz = ref_joint.get('z', 0.0)

        scale = math.sqrt((rx - wx)**2 + (ry - wy)**2 + (rz - wz)**2)
        if scale == 0:
            scale = 1.0

        normalized = []
        for pt in raw_landmarks:
            normalized.append({
                'x': (pt.get('x', 0.0) - wx) / scale,
                'y': (pt.get('y', 0.0) - wy) / scale,
                'z': (pt.get('z', 0.0) - wz) / scale
            })

        return normalized

    @classmethod
    def compute_cosine_similarity(cls, vec_a: List[float], vec_b: List[float]) -> float:
        """Compute cosine similarity between two feature vectors."""
        min_len = min(len(vec_a), len(vec_b))
        if min_len == 0:
            return 0.0

        dot_product = sum(vec_a[i] * vec_b[i] for i in range(min_len))
        norm_a = math.sqrt(sum(vec_a[i] ** 2 for i in range(min_len)))
        norm_b = math.sqrt(sum(vec_b[i] ** 2 for i in range(min_len)))

        if norm_a == 0 or norm_b == 0:
            return 0.0

        return dot_product / (norm_a * norm_b)

    def classify_frame(self, feature_vector: List[float]) -> Tuple[Optional[str], float]:
        """
        Match an input landmark feature vector against ISL reference templates.
        Returns: (predicted_sign_id, confidence_score)
        """
        if not feature_vector:
            return None, 0.0

        best_sign = None
        best_score = -1.0

        for sign_id, data in REFERENCE_TEMPLATES.items():
            ref_feat = data['features']
            score = self.compute_cosine_similarity(feature_vector, ref_feat)
            if score > best_score:
                best_score = score
                best_sign = sign_id

        # Confidence percentage (0 to 100)
        confidence = max(0.0, min(99.0, round(best_score * 100.0, 1)))

        # Temporal filter
        if best_sign and confidence >= 55.0:
            self.history_buffer.append(best_sign)
            if len(self.history_buffer) > self.buffer_size:
                self.history_buffer.pop(0)

            # Check frequency in buffer
            most_common = max(set(self.history_buffer), key=self.history_buffer.count)
            count = self.history_buffer.count(most_common)

            if count >= 3:
                return most_common, confidence

        return best_sign, confidence
