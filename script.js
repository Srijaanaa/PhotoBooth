// Get elements
const video = document.getElementById('video');
const videoCanvas = document.getElementById('videoCanvas');
const captureCanvas = document.getElementById('captureCanvas');
const photo = document.getElementById('photo');
const captureBtn = document.getElementById('capture');
const captureMode = document.getElementById('captureMode');
const filterSelect = document.getElementById('filter');
const flipToggle = document.getElementById('flipToggle');
const downloadLink = document.getElementById('download');
const countdownDisplay = document.getElementById('countdown');

let currentFilter = 'none';
let isFlipped = false;

// Access webcam
async function startWebcam() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Webcam access is not supported in this browser.');
    }
    console.log('Requesting webcam access...');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log('Webcam stream received:', stream);
    const videoTracks = stream.getVideoTracks();
    console.log('Video tracks:', videoTracks);
    if (videoTracks.length === 0) {
      console.error('No video tracks in stream. Camera may be blocked or unavailable.');
      alert('No video tracks found. Please check your camera and try again.');
    } else {
      videoTracks.forEach(track => {
        console.log('Video track state:', track.readyState, 'Enabled:', track.enabled);
      });
    }
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      console.log('Video metadata loaded. Width:', video.videoWidth, 'Height:', video.videoHeight);
      setCanvasSize('single');
      video.play().then(() => {
        startVideoFilter();
        console.log('Webcam initialized successfully');
      }).catch(err => {
        console.error('Error playing video:', err);
        alert('Failed to play webcam stream. Please try again.');
      });
    };
    video.onerror = (err) => {
      console.error('Video element error:', err);
      alert('Failed to load webcam stream. Please check your camera and try again.');
    };
  } catch (err) {
    console.error('Error accessing webcam:', err);
    let errorMessage = 'Could not access webcam. Please ensure it is connected and permissions are granted.';
    if (err.name === 'NotAllowedError') {
      errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
    } else if (err.name === 'NotFoundError') {
      errorMessage = 'No webcam found. Please connect a webcam and try again.';
    } else if (err.message.includes('not supported')) {
      errorMessage = 'This browser does not support webcam access. Try using a modern browser like Chrome or Firefox.';
    }
    alert(errorMessage);
  }
}

// Set canvas dimensions based on capture mode
function setCanvasSize(mode) {
  const singleWidth = video.videoWidth || 640;
  const singleHeight = video.videoHeight || 480;
  // Video canvas (preview) always maintains single photo size
  videoCanvas.width = singleWidth;
  videoCanvas.height = singleHeight;
  // Capture canvas adjusts based on mode
  captureCanvas.width = singleWidth;
  if (mode === 'triple') {
    const gap = 10;
    captureCanvas.height = singleHeight * 3 + gap * 2;
  } else {
    captureCanvas.height = singleHeight;
  }
  console.log(`Canvas size set: videoCanvas ${videoCanvas.width}x${videoCanvas.height}, captureCanvas ${captureCanvas.width}x${captureCanvas.height} for ${mode} mode`);
}

// Apply filter to canvas
function applyFilter(context, filter, width, height, offsetY = 0) {
  if (filter === 'none') return;
  const imageData = context.getImageData(0, offsetY, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (filter === 'grayscale') {
      const avg = (r + g + b) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    } else if (filter === 'sepia') {
      data[i] = r * 0.393 + g * 0.769 + b * 0.189;
      data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    } else if (filter === 'bright') {
      data[i] = Math.min(255, r * 1.2);
      data[i + 1] = Math.min(255, g * 1.2);
      data[i + 2] = Math.min(255, b * 1.2);
    } else if (filter === 'dark') {
      data[i] = r * 0.8;
      data[i + 1] = g * 0.8;
      data[i + 2] = b * 0.8;
    } else if (filter === 'contrast') {
      const factor = 1.5;
      data[i] = Math.min(255, Math.max(0, (r - 128) * factor + 128));
      data[i + 1] = Math.min(255, Math.max(0, (g - 128) * factor + 128));
      data[i + 2] = Math.min(255, Math.max(0, (b - 128) * factor + 128));
    }
  }

  context.putImageData(imageData, 0, offsetY);
}

// Apply blur filter (simple box blur)
function applyBlur(context, width, height, offsetY = 0) {
  const imageData = context.getImageData(0, offsetY, width, height);
  const data = imageData.data;
  const tempData = new Uint8ClampedArray(data);
  const radius = 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const i = (ny * width + nx) * 4;
            r += tempData[i];
            g += tempData[i + 1];
            b += tempData[i + 2];
            count++;
          }
        }
      }
      const i = (y * width + x) * 4;
      data[i] = r / count;
      data[i + 1] = g / count;
      data[i + 2] = b / count;
    }
  }

  context.putImageData(imageData, 0, offsetY);
}

// Apply horizontal flip
function applyFlip(context, width, height, offsetY = 0, sourceCanvas = video) {
  context.save();
  // Only flip horizontally, don't translate on y-axis
  context.translate(width, 0);
  context.scale(-1, 1);
  // Draw the image at the correct y-offset
  context.drawImage(sourceCanvas, 0, 0, width, height, 0, offsetY, width, height);
  context.restore();
}

// Apply border for single photo (big bottom border)
function applySingleBorder(context, width, height) {
  const borderWidth = 20;
  const bottomBorderWidth = 60;
  const totalWidth = width + 2 * borderWidth;
  const totalHeight = height + borderWidth + bottomBorderWidth;
  context.fillStyle = 'white';
  context.fillRect(0, 0, totalWidth, totalHeight);
  context.drawImage(captureCanvas, 0, 0, width, height, borderWidth, borderWidth, width, height);
  return { totalWidth, totalHeight };
}

// Apply border for triple photo (equal borders with gaps, no black lines)
function applyTripleBorder(context, width, height, singleHeight) {
  const borderWidth = 20;
  const gap = 10;
  const totalWidth = width + 2 * borderWidth;
  const totalHeight = height + 2 * borderWidth;
  context.fillStyle = 'white';
  context.fillRect(0, 0, totalWidth, totalHeight);

  // Draw each photo with gaps
  for (let i = 0; i < 3; i++) {
    const yOffset = i * (singleHeight + gap);
    console.log(`Drawing photo ${i + 1} from captureCanvas at source yOffset ${yOffset} to tempCanvas at y ${borderWidth + yOffset}`);
    context.drawImage(
      captureCanvas,
      0, yOffset, width, singleHeight, // Source rectangle
      borderWidth, borderWidth + yOffset, width, singleHeight // Destination rectangle
    );
  }

  return { totalWidth, totalHeight };
}

// Real-time video filter
function startVideoFilter() {
  const context = videoCanvas.getContext('2d');
  function drawFrame() {
    try {
      if (isFlipped) {
        applyFlip(context, videoCanvas.width, videoCanvas.height, 0, video);
      } else {
        context.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
      }
      if (currentFilter !== 'none') {
        if (currentFilter === 'blur') {
          applyBlur(context, videoCanvas.width, videoCanvas.height);
        } else {
          applyFilter(context, currentFilter, videoCanvas.width, videoCanvas.height);
        }
      }
      console.log('Video frame rendered successfully');
    } catch (err) {
      console.error('Error rendering video frame:', err);
    }
    requestAnimationFrame(drawFrame);
  }
  drawFrame();
}

// Update filter when selection changes
filterSelect.addEventListener('change', () => {
  currentFilter = filterSelect.value;
  console.log('Filter changed to:', currentFilter);
});

// Update flip state when toggle changes
flipToggle.addEventListener('change', () => {
  isFlipped = flipToggle.checked;
  console.log('Flip toggle set to:', isFlipped);
});

// Display countdown
async function showCountdown() {
  try {
    console.log('Starting countdown...');
    countdownDisplay.style.display = 'block';
    for (let i = 3; i >= 1; i--) {
      console.log(`Countdown: ${i}`);
      countdownDisplay.textContent = i;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    countdownDisplay.style.display = 'none';
    console.log('Countdown finished');
  } catch (err) {
    console.error('Countdown error:', err);
    throw err;
  }
}

// Generate unique filename
function generateFilename(mode) {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `photobooth-${mode}-${timestamp}.png`;
}

// Capture a single photo
function captureSinglePhoto() {
  setCanvasSize('single');
  const context = captureCanvas.getContext('2d');
  if (isFlipped) {
    applyFlip(context, captureCanvas.width, captureCanvas.height, 0, video);
  } else {
    context.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
  }
  const selectedFilter = filterSelect.value;
  if (selectedFilter !== 'none') {
    if (selectedFilter === 'blur') {
      applyBlur(context, captureCanvas.width, captureCanvas.height);
    } else {
      applyFilter(context, selectedFilter, captureCanvas.width, captureCanvas.height);
    }
  }
  const tempCanvas = document.createElement('canvas');
  const { totalWidth, totalHeight } = applySingleBorder(tempCanvas.getContext('2d'), captureCanvas.width, captureCanvas.height);
  tempCanvas.width = totalWidth;
  tempCanvas.height = totalHeight;
  applySingleBorder(tempCanvas.getContext('2d'), captureCanvas.width, captureCanvas.height);
  displayPhoto(tempCanvas, 'single');
}

// Capture three photos with countdown
async function captureTriplePhoto() {
  console.log('Starting triple photo capture...');
  setCanvasSize('triple');
  const context = captureCanvas.getContext('2d');
  const singleHeight = (video.videoHeight || 480);
  const singleWidth = (video.videoWidth || 640);
  const gap = 10;

  for (let i = 0; i < 3; i++) {
    console.log(`Capturing photo ${i + 1}...`);
    if (!video.srcObject || !video.srcObject.getVideoTracks().some(track => track.readyState === 'live')) {
      throw new Error('Video stream is not active. Please check webcam.');
    }

    await showCountdown();
    const yOffset = i * (singleHeight + gap);
    console.log(`Drawing photo ${i + 1} at offset ${yOffset}`);
    if (isFlipped) {
      applyFlip(context, singleWidth, singleHeight, yOffset, video);
    } else {
      context.drawImage(video, 0, yOffset, singleWidth, singleHeight);
    }
    const selectedFilter = filterSelect.value;
    if (selectedFilter !== 'none') {
      console.log(`Applying filter ${selectedFilter} to photo ${i + 1}`);
      if (selectedFilter === 'blur') {
        applyBlur(context, singleWidth, singleHeight, yOffset);
      } else {
        applyFilter(context, selectedFilter, singleWidth, singleHeight, yOffset);
      }
    }
  }

  console.log('Creating temporary canvas for triple photo border...');
  const tempCanvas = document.createElement('canvas');
  const { totalWidth, totalHeight } = applyTripleBorder(tempCanvas.getContext('2d'), captureCanvas.width, captureCanvas.height, singleHeight);
  tempCanvas.width = totalWidth;
  tempCanvas.height = totalHeight;
  applyTripleBorder(tempCanvas.getContext('2d'), captureCanvas.width, captureCanvas.height, singleHeight);
  displayPhoto(tempCanvas, 'triple');
  console.log('Triple photo capture completed');
}

// Display and set up download
function displayPhoto(tempCanvas, mode) {
  try {
    photo.src = tempCanvas.toDataURL('image/png');
    photo.classList.remove('hidden');
    downloadLink.href = tempCanvas.toDataURL('image/png');
    downloadLink.download = generateFilename(mode);
    downloadLink.classList.remove('hidden');
    console.log('Photo captured and download button displayed for', mode, 'mode');
  } catch (err) {
    console.error('Error displaying photo:', err);
    alert('Failed to display photo. Please try again.');
  }
}

// Capture button event listener
captureBtn.addEventListener('click', async () => {
  const mode = captureMode.value;
  captureBtn.disabled = true;
  console.log('Capture button clicked for', mode, 'mode');
  try {
    if (mode === 'single') {
      captureSinglePhoto();
    } else {
      await captureTriplePhoto();
    }
  } catch (err) {
    console.error('Capture error:', err);
    alert('Failed to capture photo. Please check webcam and try again.');
  } finally {
    captureBtn.disabled = false;
  }
});

// Update canvas size when capture mode changes
captureMode.addEventListener('change', () => {
  setCanvasSize(captureMode.value);
  console.log('Capture mode changed to:', captureMode.value);
});

// Start webcam on page load
startWebcam();
