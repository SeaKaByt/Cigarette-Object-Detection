// Import dependencies
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./model.css";
// Import drawing utility here
import { drawRect } from "./utilities";
import { debounce } from 'lodash';

function ModelApp() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [isSmokingDetected, setIsSmokingDetected] = useState(false);

    const sendImageDataWithCooldown = debounce(sendImageDataToServer, 1000);

    // Main function
    const runCoco = async () => {
        // Load network 
        const net = await tf.loadGraphModel('https://storage.googleapis.com/fyp_2022_2023/model.json')

        // Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 16.7);
    };

    const handleSetSmokingDetected = () => {
        setIsSmokingDetected(true);
    
        setTimeout(() => {
          setIsSmokingDetected(false);
        }, 1500);
      };

    function sendImageDataToServer(imageData) {
        console.log('received');
        fetch('/addRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: imageData }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const detect = async (net) => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const img = tf.browser.fromPixels(video)
            const resized = tf.image.resizeBilinear(img, [680, 680])
            const casted = resized.cast('int32')
            const expanded = casted.expandDims(0)
            const obj = await net.executeAsync(expanded)

            const boxes = await obj[5].array()
            const classes = await obj[2].array()
            const scores = await obj[7].array()

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");

            requestAnimationFrame(() => { drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx) });

            handleDetection(boxes[0], classes[0], scores[0], 0.8);

            function handleDetection(boxes, classes, scores, threshold) {
                for (let i = 0; i < boxes.length; i++) {
                    if (boxes[i] && classes[i] === 2 && scores[i] > threshold) {
                        const canvas = canvasRef.current; // A reference created using useRef

                        const video = webcamRef.current.video;
                        const ctx = canvas.getContext("2d");

                        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

                        // Screenshot Data (Encoded in Base64)
                        const imageData = canvas.toDataURL('image/jpeg');

                        localStorage.setItem('screenshot', imageData);
                        const savedImageData = localStorage.getItem('screenshot');

                        if (savedImageData) {
                            sendImageDataWithCooldown(imageData);
                            handleSetSmokingDetected();
                            console.log('send an image');
                        }
                    }
                }
            }

            tf.dispose(img)
            tf.dispose(resized)
            tf.dispose(casted)
            tf.dispose(expanded)
            tf.dispose(obj)
        }
    };

    useEffect(() => { runCoco() }, []);

    return (
        <div className="App">
            <header className="App-header">
                <Webcam
                    ref={webcamRef}
                    muted={true}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 8,
                        width: 640,
                        height: 480,
                    }}
                />
                {/* Cigarette detection alert. */}
                {isSmokingDetected && (
                    <div className="smoking-detected">Cigarettes Detected！</div>
                )}
            </header>
        </div>
    );
}

export default ModelApp;
