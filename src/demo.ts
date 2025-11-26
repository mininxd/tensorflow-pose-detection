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

import '@tensorflow/tfjs-backend-webgl';
import { createDetector, SupportedModels, util } from './index';

// DOM elements
const video = document.getElementById('video') as HTMLVideoElement;
const output = document.getElementById('output') as HTMLCanvasElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const status = document.getElementById('status') as HTMLDivElement;

let detector;
let animationId;
let isDetecting = false;
let ctx: CanvasRenderingContext2D;

// Initialize canvas context
ctx = output.getContext('2d');

// Set up event listeners
startBtn.addEventListener('click', startPoseDetection);
stopBtn.addEventListener('click', stopPoseDetection);

// Utility functions to draw keypoints and skeleton
function drawKeypoints(ctx: CanvasRenderingContext2D, keypoints: any[], minScore = 0.2) {
  const keypointInd = util.getKeypointIndexBySide(SupportedModels.BlazePose);

  ctx.fillStyle = 'Red';
  ctx.strokeStyle = 'White';
  ctx.lineWidth = 2;

  // Draw middle keypoints
  for (const i of keypointInd.middle) {
    if (keypoints[i] && keypoints[i].score >= minScore) {
      drawKeypoint(ctx, keypoints[i]);
    }
  }

  ctx.fillStyle = 'Green';
  // Draw left keypoints
  for (const i of keypointInd.left) {
    if (keypoints[i] && keypoints[i].score >= minScore) {
      drawKeypoint(ctx, keypoints[i]);
    }
  }

  ctx.fillStyle = 'Orange';
  // Draw right keypoints
  for (const i of keypointInd.right) {
    if (keypoints[i] && keypoints[i].score >= minScore) {
      drawKeypoint(ctx, keypoints[i]);
    }
  }
}

function drawKeypoint(ctx: CanvasRenderingContext2D, keypoint: any) {
  const circle = new Path2D();
  circle.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
  ctx.fill(circle);
  ctx.stroke(circle);
}

function drawConnectors(ctx: CanvasRenderingContext2D, keypoints: any[], minScore = 0.2) {
  const adjacentPairs = util.getAdjacentPairs(SupportedModels.BlazePose);

  ctx.strokeStyle = 'White';
  ctx.lineWidth = 2;

  for (const [i, j] of adjacentPairs) {
    if (
      keypoints[i] &&
      keypoints[j] &&
      keypoints[i].score >= minScore &&
      keypoints[j].score >= minScore
    ) {
      ctx.beginPath();
      ctx.moveTo(keypoints[i].x, keypoints[i].y);
      ctx.lineTo(keypoints[j].x, keypoints[j].y);
      ctx.stroke();
    }
  }
}

async function startPoseDetection() {
  status.textContent = 'Accessing camera...';
  
  try {
    // Get video stream from camera
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480 } 
    });
    
    video.srcObject = stream;
    
    // Wait for video to be loaded
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        output.width = video.videoWidth;
        output.height = video.videoHeight;
        resolve(null);
      };
    });
    
    // Create pose detector
    status.textContent = 'Loading model...';
    detector = await createDetector(SupportedModels.BlazePose, {
      runtime: 'tfjs',
      modelType: 'full'
    });
    
    status.textContent = 'Detection started';
    isDetecting = true;
    
    // Start detection loop
    detectPose();
  } catch (error) {
    console.error('Error accessing camera:', error);
    status.textContent = `Error: ${error.message}`;
  }
}

function stopPoseDetection() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  if (video.srcObject) {
    const tracks = (video.srcObject as MediaStream).getTracks();
    tracks.forEach(track => track.stop());
  }
  
  if (detector) {
    detector.dispose();
    detector = null;
  }
  
  isDetecting = false;
  status.textContent = 'Detection stopped';
}

async function detectPose() {
  if (!isDetecting) return;
  
  try {
    // Estimate poses
    const poses = await detector.estimatePoses(video);
    
    // Clear canvas
    ctx.clearRect(0, 0, output.width, output.height);
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, output.width, output.height);
    
    // Draw poses if detected
    if (poses && poses.length > 0) {
      for (const pose of poses) {
        // Draw keypoints
        drawKeypoints(ctx, pose.keypoints, 0.2);
        
        // Draw connectors
        drawConnectors(ctx, pose.keypoints, 0.2);
      }
    }
  } catch (error) {
    console.error('Error during pose detection:', error);
  }
  
  // Continue detection loop
  if (isDetecting) {
    animationId = requestAnimationFrame(detectPose);
  }
}