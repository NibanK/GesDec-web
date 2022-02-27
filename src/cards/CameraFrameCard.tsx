import React, { useRef, useEffect, useState, useContext } from 'react';
import CornerRoundedBtn from '../items/button/CornerRoundedBtn';
import { Colors } from '../models/enums/ColorsEnum';
import { Holistic } from '@mediapipe/holistic';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import predictionContext from '../context/prediction/PredictionContext';
import { PredictionContextDto } from '../models/dtos/ContextDtos';
import signs from '../models/constants/Signs';

export default function cameraRefFrameCard() {
  const [iscameraRefOn, setcameraRef] = useState(false);
  // const [isCamerStart, setCameraStart] = useState(true);
  const predictionProvider = useContext(predictionContext) as PredictionContextDto;
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  const predictionsRef = useRef([]);
  const modelRef = useRef(null);
  const sequenceRef = useRef([]);
  const threshold = 0.0;
  console.log('cameraFrame');

  // flatten the results of the keypoints
  function extractKeypoints(results) {
    const face = results.faceLandmarks
      ? results.faceLandmarks.map((res) => [res.x, res.y, res.z]).flat()
      : new Array(1404).fill(0.0);

    const left =
      results.leftHandLandmarks != undefined
        ? results.leftHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
        : new Array(63).fill(0.0);
    const right =
      results.rightHandLandmarks != undefined
        ? results.rightHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
        : new Array(63).fill(0.0);
    const pose =
      results.poseLandmarks != undefined
        ? results.poseLandmarks.map((res) => [res.x, res.y, res.z, res.visibility]).flat()
        : new Array(132).fill(0.0);
    return [face, left, right, pose].flat();
  }

  // stops the camera
  const stopCamera = () => {
    let stream = webcamRef.current.video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    webcamRef.current.video.srcObject = null;
    cameraRef.current = null;
  };
  // listener function of the keypoints
  async function onResults(results) {
    const keypoints = extractKeypoints(results);
    // console.log(keypoints);
    sequenceRef.current.push(keypoints);
    sequenceRef.current = sequenceRef.current.slice(-30);
    if (sequenceRef.current.length == 30) {
      // console.log(sequenceRef.current.length);
      // const dummy = await modelRef.current.predict(
      //   tf.expandDims(sequenceRef.current.slice(-30), 0),
      // );
      // console.log(dummy.dataSync());
      const res = await modelRef.current
        .predict(tf.expandDims(sequenceRef.current, 0))
        .arraySync()[0];
      console.log(res);
      const index = parseInt(tf.argMax(res).arraySync().toString());

      predictionsRef.current.push(index);
      console.log(predictionsRef.current.slice(-20));
      // console.log(tf.unique(predictionsRef.current.slice(-20)));
      if (tf.unique(predictionsRef.current.slice(-20)).values.arraySync()[0] == index) {
        // if (res[index] > 0.0) {
        const prediction = signs[index];
        console.log(prediction);

        predictionProvider.insertPrediction(
          prediction,
          Math.round(res[parseInt(index.toString())] * 100),
        );
        // }
      }
    }
  }

  const onClickHandler = async () => {
    if (iscameraRefOn) {
      stopCamera();
      predictionProvider.clearPredictions();
      sequenceRef.current = [];
      predictionsRef.current = [];
      setcameraRef(false);
    } else {
      setcameraRef(true);
    }
  };
  useEffect(() => {
    if (cameraRef.current == null) {
      // initialize holistic

      const holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        },
      });
      holistic.setOptions({
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      // initialize listener for each frame
      holistic.onResults(onResults);

      // checking if cameraRef is open or not
      if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null) {
        cameraRef.current = new cam.Camera(webcamRef.current.video, {
          onFrame: async () => {
            await holistic.send({ image: webcamRef.current.video });
          },
          width: 1280,
          height: 720,
        });
        //  starts the cameraRef session for extracting keypoints
        cameraRef.current.start();
        async () => {};
        // setCameraStart(true);
      }
    }
    if (modelRef.current == null) {
      modelRef.current = '';
      tf.loadLayersModel('https://gesdec-api.herokuapp.com/model').then((value) => {
        modelRef.current = value;
        // modelRef.current.save('indexeddb://SLR');
        console.log(modelRef.current);
      });
    }
  });

  return iscameraRefOn ? (
    <div className="flex flex-col bg-gray-300 shadow-xl border-2 border-gray-400  justify-start items-center   rounded-md   h-[450px] lg:w-[500px] sm:w-full space-y-4">
      <Webcam className="spinner h-[375px] w-full" ref={webcamRef} />
      <div className="w-20  cursor-pointer" onClick={onClickHandler}>
        <CornerRoundedBtn value={'Stop'} btnColor="bg-dangerColor" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col bg-gray-300 shadow-xl border-2 border-gray-400  justify-center items-center   rounded-md   h-[450px] lg:w-[500px] sm:w-full space-y-12">
      <img src="/gifs/welcome.gif" />
      <div className="lg:w-36  cursor-pointer" onClick={onClickHandler}>
        <CornerRoundedBtn value={'Start Prediction'} btnColor={'bg-blue-500'} />
      </div>
    </div>
  );
}