import { IBook } from '@/types';
import React from 'react';
import { BookCard } from './BookCard';

interface IProps {
  title: string;
  books: IBook[];
  containerClassName?: string;
}

export const BookList = ({ title, books, containerClassName }: IProps) => {
  return (
    <section className={containerClassName}>
      <h2 className='font-bebas-neue text-4xl text-lime-100'>{title}</h2>
      <ul className='book-list'>
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </ul>
    </section>
  );
};
