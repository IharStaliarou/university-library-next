'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { BookCoverSvg } from './BookCoverSvg';
import { IKImage } from 'imagekitio-next';
import config from '@/lib/config';

type TBookCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const VARIANT_STYLES: Record<TBookCoverVariant, string> = {
  extraSmall: 'book-cover_extra_small',
  small: 'book-cover_small',
  medium: 'book-cover_medium',
  regular: 'book-cover_regular',
  wide: 'book-cover_wide',
};

interface IProps {
  coverColor: string;
  coverUrl?: string;
  variant?: TBookCoverVariant;
  className?: string;
}

export const BookCover = ({
  className,
  variant = 'regular',
  coverColor = '#012b48',
  coverUrl = 'https://placehold.co/400x600.png',
}: IProps) => {
  return (
    <div
      className={cn(
        'relative transition-all duration-300',
        VARIANT_STYLES[variant],
        className
      )}
    >
      <BookCoverSvg coverColor={coverColor} />
      <div
        className='absolute z-10'
        style={{ left: '12%', width: '87.5%', height: '88%' }}
      >
        <IKImage
          path={coverUrl}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt='Book cover'
          fill
          className='rounded-sm object-fill'
          loading='lazy'
          lqip={{ active: true }}
        />
      </div>
    </div>
  );
};
