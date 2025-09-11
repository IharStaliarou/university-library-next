import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { books } from '@/database/schema';
import { db } from '@/database/drizzle';
import { auth } from '@/auth';
import BookOverview from '@/components/shared/BookOverview';
import BookVideo from '@/components/shared/BookVideo';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const id = (await params).id;
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect('/404');
  console.log(bookDetails);
  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

      <div className='book-details'>
        <div className='flex-[1.5]'>
          <section className='flex flex-col gap-7'>
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className='mt-10 flex flex-col gap-7'>
            <h3>Summary</h3>
            <div className='space-y-5 text-xl text-lime-100'>
              {bookDetails.summary.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Page;
