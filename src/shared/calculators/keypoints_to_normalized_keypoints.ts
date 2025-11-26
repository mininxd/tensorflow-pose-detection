/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import { Keypoint, Value } from './interfaces/common_interfaces';

export function keypointsToNormalizedKeypoints(
    imageWidth: number, imageHeight: number, keypoints: Keypoint[] = []): 
    Array<{x: number, y: number, score?: number, name?: string}> {
  if (imageWidth <= 0 || imageHeight <= 0) {
    throw new Error(`Image width and height must be positive ${imageWidth}, ${
        imageHeight}`);
  }
  return keypoints.map((keypoint) => {
    return {
      x: keypoint.x / imageWidth,
      y: keypoint.y / imageHeight,
      score: keypoint.score,
      name: keypoint.name
    };
  });
}