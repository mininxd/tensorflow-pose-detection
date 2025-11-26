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

import { PixelInput } from './interfaces/common_interfaces';

export function getImageSize(inputs: PixelInput): {height: number, width: number} {
  if ((inputs as HTMLVideoElement).videoWidth) {
    const video = inputs as HTMLVideoElement;
    return {height: video.videoHeight, width: video.videoWidth};
  } else if ((inputs as HTMLImageElement).naturalWidth) {
    const image = inputs as HTMLImageElement;
    return {height: image.naturalHeight, width: image.naturalWidth};
  } else if ((inputs as HTMLCanvasElement).width) {
    const canvas = inputs as HTMLCanvasElement;
    return {height: canvas.height, width: canvas.width};
  } else {
    throw new Error('Input must be an HTMLVideoElement, HTMLImageElement, or HTMLCanvasElement');
  }
}

export function toImageTensor() {
  // Placeholder implementation
  throw new Error('toImageTensor is not fully implemented in this refactored version');
}

export function getProjectiveTransformMatrix() {
  // Placeholder implementation
  throw new Error('getProjectiveTransformMatrix is not fully implemented in this refactored version');
}