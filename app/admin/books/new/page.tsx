import React from 'react';
import Link from 'next/link';

import BookForm from '@/components/admin/shared/forms/BookForm';
import { Button } from '@/components/ui/button';

const Page = () => {
  return (
    <>
      <Button className='back-btn' asChild>
        <Link href='/admin/books'>Go Back</Link>
      </Button>

      <section className='w-full max-w-2xl'>
        <BookForm type='create' />
      </section>
    </>
  );
};

export default Page;
