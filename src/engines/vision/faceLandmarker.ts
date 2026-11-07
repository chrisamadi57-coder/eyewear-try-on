import {
  FaceLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

let modelPromise: Promise<FaceLandmarker> | undefined;

const XNNPACK_INFO =
  "INFO: Created TensorFlow Lite XNNPACK delegate for CPU.";

async function withFilteredXnnpackInfo<T>(action: () => Promise<T>): Promise<T> {
  const previousError = console.error;
  console.error = (...args: Parameters<typeof console.error>) => {
    if (args.length === 1 && args[0] === XNNPACK_INFO) return;
    previousError.apply(console, args);
  };

  try {
    return await action();
  } finally {
    console.error = previousError;
  }
}

export function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (!modelPromise) {
    modelPromise = withFilteredXnnpackInfo(async () => {
      const files = await FilesetResolver.forVisionTasks("/mediapipe/wasm");
      try {
        return await FaceLandmarker.createFromOptions(files, {
          baseOptions: {
            modelAssetPath: "/mediapipe/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numFaces: 2,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
        });
      } catch {
        return FaceLandmarker.createFromOptions(files, {
          baseOptions: {
            modelAssetPath: "/mediapipe/face_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "IMAGE",
          numFaces: 2,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
        });
      }
    }).catch((error: unknown) => {
      modelPromise = undefined;
      throw error;
    });
  }
  return modelPromise;
}

export type FaceAlignment = {
  x: number;
  y: number;
  width: number;
  rotation: number;
  confidence: number;
};

export function largestFace(
  faces: NormalizedLandmark[][],
): NormalizedLandmark[] | undefined {
  return faces.reduce<NormalizedLandmark[] | undefined>((largest, face) => {
    if (!largest) return face;
    const span = (points: NormalizedLandmark[]) => {
      const xs = points.map((point) => point.x);
      return Math.max(...xs) - Math.min(...xs);
    };
    return span(face) > span(largest) ? face : largest;
  }, undefined);
}

export function alignmentFromLandmarks(
  landmarks: NormalizedLandmark[],
): FaceAlignment | null {
  if (landmarks.length < 455) return null;
  const left = landmarks[468] ?? midpoint(landmarks[33], landmarks[133]);
  const right = landmarks[473] ?? midpoint(landmarks[362], landmarks[263]);
  const dx = right.x - left.x;
  const dy = right.y - left.y;
  const eyeDistance = Math.hypot(dx, dy);
  if (eyeDistance < 0.04) return null;
  return {
    x: (left.x + right.x) / 2,
    y: (left.y + right.y) / 2,
    width: Math.min(0.9, eyeDistance * 2.55),
    rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
    confidence: Math.min(1, eyeDistance / 0.15),
  };
}

function midpoint(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
): NormalizedLandmark {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
    visibility: ((a.visibility ?? 1) + (b.visibility ?? 1)) / 2,
  };
}
