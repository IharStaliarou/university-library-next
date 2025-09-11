import { Button } from '@/components/ui/button';
import { signOut } from '@/auth';
import BookList from '@/components/shared/BookList';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { desc } from 'drizzle-orm';
import { IBook } from '@/types';

const Page = async () => {
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as IBook[];
  return (
    <>
      <form
        action={async () => {
          'use server';

          await signOut();
        }}
        className='mb-10'
      >
        <Button>Logout</Button>
      </form>

      <BookList title='Borrowed Books' books={latestBooks.slice(1)} />
    </>
  );
};
export default Page;
