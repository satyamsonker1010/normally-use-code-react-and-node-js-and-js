import { useCallback, useEffect, useRef, useState } from "react";

const useCameraAccess = () => {
  // create a webcam reference
  const webcamRef = useRef(null);
  // Store capture image source like base 64 url
  const [imgSrc, setImgSrc] = useState(null);
  //   Check use camera is enable or not
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  //   Set error message is camera is disable or others error get
  const [errorMessage, setErrorMessage] = useState(null);
  // Store camera streams when camera active
  const [cameraStream, setCameraStream] = useState(null);
  // Do you want to check camera is enable or not every second
  const [everySecondCameraStatusCheck, setEverySecondCameraStatusCheck] =
    useState(false);

  // Camera start stream loading
  const [cameraStartStreamLoading, setCameraStartStreamLoading] =
    useState(false);

  // Photo capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  //  Retake photo function
  const retake = () => {
    setImgSrc(null);
  };


  const stopExistingStream = useCallback((stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    }
  });
  // Function to stop all active streams
  const stopAllStreams = useCallback(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          navigator.mediaDevices
            .getUserMedia({ video: { deviceId: device.deviceId } })
            .then((stream) => stopExistingStream(stream))
            .catch((error) => {
              console.error("Error stopping stream: ", error);
            });
        }
      });
    });
  }, []);

  useEffect(() => {
    let activeStream = null;
    stopExistingStream();
    const startCameraStream = () => {
      setCameraStartStreamLoading(true);
      if (!activeStream && !cameraStream) {
        stopAllStreams();
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            setHasCameraAccess(true);
            setCameraStream(stream);
            activeStream = stream;
            setErrorMessage(null);
            setCameraStartStreamLoading(false);
          })
          .catch((error) => {
            setHasCameraAccess(false);
            setCameraStream(null);
            setErrorMessage(
              "Camera access is denied. Please enable it in your browser settings."
            );
            setCameraStartStreamLoading(false);
          });
      } else {
        console.log("Stream already active, not starting a new one.");
        setCameraStartStreamLoading(false);
      }
    };

    startCameraStream();

    return () => {
      if (activeStream) {
        stopExistingStream(activeStream);
        stopAllStreams();
        setCameraStream(null);
        setHasCameraAccess(false);
        activeStream = null;
      }
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      console.log("Stopping camera...");
      cameraStream.getTracks().forEach((track) => {
        if (track.readyState === "live" && track.kind === "video") {
          console.log("Stopping track:", track);
          track.stop();
        }
      });
      setCameraStream(null); // Clear the camera stream
      setHasCameraAccess(false); // Update the state to indicate camera access is off
      console.log("Camera stopped successfully.");
    } else {
      console.log("No camera stream to stop.");
      setErrorMessage("No camera stream is currently active.");
    }
  }, [cameraStream]);

  useEffect(() => {
    // Monitor if the camera is turned off after it is initially on
    const checkCameraStatus = () => {
      if (cameraStream) {
        const videoTrack = cameraStream.getVideoTracks()[0];
        if (videoTrack && videoTrack.readyState === "ended") {
          setHasCameraAccess(false);
          setErrorMessage("Camera was turned off. Please enable it again.");
        }
      }
    };
    const intervalId = setInterval(checkCameraStatus, 1000); // Check every second
    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [cameraStream]);

  return {
    imageSource: imgSrc,
    setImageSource: setImgSrc,
    handleImageCapture: capture,
    webCameraRef: webcamRef,
    isUserCameraEnable: hasCameraAccess,
    setUserCameraEnable: setHasCameraAccess,
    errorMessage: errorMessage,
    setErrorMessage: setErrorMessage,
    cameraStream: cameraStream,
    setCameraStream: setCameraStream,
    everySecondCameraStatusCheck: everySecondCameraStatusCheck,
    setEverySecondCameraStatusCheck: setEverySecondCameraStatusCheck,
    retakePhoto: retake,
    handleStopCamera: stopCamera,
    isCameraLoading: cameraStartStreamLoading,
  };
};

export default useCameraAccess;
