'use client';

import { useRef, useState } from 'react';
import { ImageKitProvider, IKImage, IKUpload, IKVideo } from 'imagekitio-next';
import Image from 'next/image';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import config from '@/lib/config';

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface IProps {
  type: 'image' | 'video';
  accept: string;
  placeholder: string;
  folder: string;
  variant: 'dark' | 'light';
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  onFileChange,
  type,
  accept,
  placeholder,
  folder,
  variant,
  value,
}: IProps) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === 'dark'
        ? 'bg-dark-300'
        : 'bg-light-600 border-gray-100 border',
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast.success(`${type} uploaded successfully`, {
      description: `${res.filePath} uploaded successfully`,
    });
  };

  const onError = (error: any) => {
    console.log(error);

    toast.error(`${type} upload failed`, {
      description: `Your ${type} could not be uploaded. Please try again.`,
    });
  };

  const onValidate = (file: File) => {
    if (type === 'image') {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Image size too large', {
          description: `Please upload an image less than 100MB`,
        });
        return false;
      }
    } else if (type === 'video') {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video size too large', {
          description: `Please upload a video less than 100MB`,
        });
        return false;
      }
    }

    return true;
  };

  return (
    <ImageKitProvider
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({
          loaded,
          total,
        }: {
          loaded: number;
          total: number;
        }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className='hidden'
      />

      <button
        className={cn('upload-btn', styles.button)}
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src='/icons/upload.svg'
          alt='upload'
          width={20}
          height={20}
          className='object-contain'
        />

        <p className={cn('upload-placeholder', styles.placeholder)}>
          {file && file.filePath
            ? file.filePath.replace(/^.*[\\\/]/, '')
            : placeholder}
        </p>
      </button>

      {progress > 0 && progress !== 100 && (
        <div className='w-full rounded-full bg-green-200'>
          <div className='progress' style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file &&
        (type === 'image' ? (
          <IKImage
            alt={file.filePath ?? ''}
            path={file.filePath ?? ''}
            width={500}
            height={300}
          />
        ) : type === 'video' ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className='w-full h-96 rounded-xl'
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;
