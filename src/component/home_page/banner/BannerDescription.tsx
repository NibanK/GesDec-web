import React from 'react';
import { motion } from 'framer-motion';
// Homepage banner description

export default function BannerDescription() {
  const scrollToBottom = () =>
    window.scrollTo({ top: 1.6 * window.screen.height, behavior: 'smooth' });
  return (
    <div className="flex flex-col space-y-4  items-start justify-start text-white font-sans lg:pt-12 sm:pt-4">
      <p className="lg:text-3xl sm:text-xl font-medium ">Gesture Detection and Recognition</p>
      <motion.div
        initial={{ x: '-200', opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="rounded-full w-24 h-[2px] bg-primary"
      ></motion.div>
      <p className="lg:text-base sm:text-sm text-start text-gray-400  font-extralight ">
        Our model is mainly focused on sign gestures. You can predict 10 of the sign gestures. The
        demo video is shown for all of the gestures in the right side of the banner. You can also
        check our model details by clicking{' '}
        <span className="text-primary font-light cursor-pointer" onClick={scrollToBottom}>
          Go to details
        </span>{' '}
        button.
      </p>
    </div>
  );
}
