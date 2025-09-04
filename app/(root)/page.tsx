import { BookList, BookOverview } from '@/components/shared';
import { sampleBooks } from '@/constants';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';

const Home = async () => {
  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title='Latest books'
        books={sampleBooks}
        containerClassName='mt-28'
      />
    </>
  );
};

export default Home;
