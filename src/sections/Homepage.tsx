import BannerDescription from '../component/home_page/banner/BannerDescription';
import CameraFrameCard from '../cards/CameraFrameCard';
import Navbar from '../component/shared/Navbar';
import FeedbackForm from '../items/form/FeedbackForm';
import PredictionCard from '../cards/PredictionCard';
import { useContext } from 'react';
import predictionContext from '../context/prediction/PredictionContext';
import { PredictionContextDto } from '../models/dtos/ContextDtos';
import signs from '../models/constants/Signs';
import { motion } from 'framer-motion';

export default function Homepage() {
  const res = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 2, 123, 123, 124, 123, 13, 123, 123, 123, 1];
  console.log('homepage');

  const predictionProvider = useContext(predictionContext) as PredictionContextDto;
  // predictionProvider.predictions;
  // #1A2238
  return (
    <div>
      <Navbar from="Homepage" />
      {/* banner container */}
      <div className="flex lg:flex-row sm:flex-col lg:space-y-0 sm:space-y-8 sm:px-4 lg:space-x-32 sm:space-x-0 lg:justify-between sm:justify-center  items-start  bg-[#1A2238] pt-16 pb-20 w-full lg:px-44  ">
        <BannerDescription />
        <img src="gifs/sl_gesture.gif" className="h-[300px]" />
      </div>
      <motion.div className="flex lg:flex-row md:flex-col sm:flex-col lg:space-x-36 sm:space-x-0 sm:items-center justify-between lg:mx-44 sm:mx-4 mt-16 mb-28">
        <div className="flex flex-col space-y-2">
          {predictionProvider.prediction != '' ? (
            <PredictionCard
              title={predictionProvider.prediction}
              accuracy={predictionProvider.getAccuracy()}
            />
          ) : (
            <div className="h-12" />
          )}
          {/* camera container */}
          <CameraFrameCard />
        </div>

        {/* prediction container */}

        <div className="flex flex-col   space-y-2  pt-12 lg:justify-start sm:justify-start lg:items-center sm:items-start  lg:h-[450px] sm:h-[350px] lg:w-[500px] sm:w-full lg:pr-6 sm:pr-0">
          <div className="flex flex-col items-center justify-center space-y-10 pt-16">
            <p className="lg:text-lg sm:text-base font-medium text-center text-gray-800">
              You can predict among the 10 labels. View model details to check about the models
              summary and details.
            </p>
            <motion.div
              initial={{ x: '200', opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 50 }}
              className="flex flex-wrap items-center justify-center"
            >
              {signs.map((sign) => (
                <div
                  className={`flex justify-center rounded-2xl m-2 ${
                    predictionProvider.prediction === sign ? 'bg-green-400' : 'bg-[#9DAAF2]'
                  } px-3 py-2 text-xs font-semibold  text-white`}
                >
                  {sign}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* feedback container */}
      <motion.div className="flex justify-center  bg-gray-200 py-8">
        <FeedbackForm />
      </motion.div>
    </div>
  );
}
