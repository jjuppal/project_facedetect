const video = document.getElementById('video')
countFaceExpression = false;
var angry = 0;
var happy = 0;
var neutral = 0;
var surprised = 0;
var disgusted = 0;
var sad = 0;
var time = 100;


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  document.getElementById("motion").append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

      if (countFaceExpression == false) {
        if (time > 0) {
          if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7) {
            if (resizedDetections[0].expressions.happy > 0.5) {
              console.log("happy");
              happy += 1;
            }
      
            if (resizedDetections[0].expressions.angry > 0.5) {
              console.log("angry");
              angry += 1;
            }

            if (resizedDetections[0].expressions.surprised > 0.5) {
              console.log("surprised");
              surprised += 1;
            }

            if (resizedDetections[0].expressions.neutral > 0.5) {
              console.log("neutral");
              neutral += 1;
            }

            if (resizedDetections[0].expressions.disgusted > 0.5) {
              console.log("disgusted");
              disgusted += 1;
            }
            
            if (resizedDetections[0].expressions.sad > 0.5) {
              console.log("sad");
              sad += 1;
            }
          }
          time--;
        }
        else {
        countFaceExpression = true;
        }
      }
                
  }, 100)

})

function faceDetect() {
  if (happy > angry && happy > neutral && happy > disgusted && happy > sad && happy > surprised) {
    var url = "happy금액.html";
    window.open(url);
  }
  else if (neutral > angry && neutral > happy && neutral > disgusted && neutral > sad && neutral > surprised) {
    var url = "happy금액.html";
    window.open(url);
  }
  else {
    var url = "angry금액.html";
    window.open(url);
  }
}