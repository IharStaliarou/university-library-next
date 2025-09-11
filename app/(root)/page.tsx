import { auth } from '@/auth';
import { BookList, BookOverview } from '@/components/shared';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { IBook } from '@/types';
import { desc } from 'drizzle-orm';

const Home = async () => {
  const session = await auth();
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as IBook[];

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />
      <BookList
        title='Latest books'
        books={latestBooks.slice(1)}
        containerClassName='mt-28'
      />
    </>
  );
};

export default Home;
