'use client';

import { IKVideo, ImageKitProvider } from 'imagekitio-next';

import config from '@/lib/config';

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  console.log('videoUrl', videoUrl);
  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <IKVideo part={videoUrl} controls={true} className='w-full rounded-xl' />
    </ImageKitProvider>
  );
};
export default BookVideo;
