import ImageKit from 'imagekit';
import dummyBooks from '../dummyBooks.json';
import { books } from './schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config({ path: '.env' });

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

const getFilesInFolder = async (folderPath: string): Promise<any[]> => {
  try {
    const response = await imageKit.listFiles({
      path: folderPath,
      limit: 1000,
    });
    return response;
  } catch (error) {
    console.error(`Error listing files in ${folderPath}:`, error);
    return [];
  }
};

const deleteImageKitFiles = async (fileIds: string[]): Promise<void> => {
  if (fileIds.length === 0) return;

  try {
    for (const fileId of fileIds) {
      await imageKit.deleteFile(fileId);
      console.log(`🗑️ Deleted file: ${fileId}`);
    }
  } catch (error) {
    console.error('Error deleting files from ImageKit:', error);
  }
};

const cleanupImageKitFolder = async (folderPath: string): Promise<void> => {
  try {
    console.log(`🧹 Cleaning up folder: ${folderPath}`);
    const files = await getFilesInFolder(folderPath);

    if (files.length > 0) {
      const fileIds = files.map((file) => file.fileId);
      console.log(`Found ${fileIds.length} files to delete in ${folderPath}`);
      await deleteImageKitFiles(fileIds);
      console.log(`✅ Cleaned up ${fileIds.length} files from ${folderPath}`);
    } else {
      console.log(`📁 Folder ${folderPath} is already empty`);
    }
  } catch (error) {
    console.error(`Error cleaning up folder ${folderPath}:`, error);
  }
};

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string
): Promise<string> => {
  try {
    const response = await imageKit.upload({
      file: url,
      fileName,
      folder,
    });

    if (!response.filePath) {
      throw new Error('No filePath returned from ImageKit');
    }

    return response.filePath;
  } catch (error) {
    console.error(`Error uploading ${fileName} to ImageKit:`, error);
    throw error;
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const seed = async () => {
  try {
    console.log('🚀 Starting seed process...');

    console.log('\n🧹 Cleaning up ImageKit folders...');
    await cleanupImageKitFolder('/books/covers');
    await cleanupImageKitFolder('/books/videos');

    await db.delete(books);
    console.log('✅ Cleared existing books data from database');

    console.log(`\n📚 Processing ${dummyBooks.length} books...`);

    for (const [index, book] of dummyBooks.entries()) {
      console.log(
        `\n📖 Processing (${index + 1}/${dummyBooks.length}): ${book.title}`
      );

      const coverUrl = await uploadToImageKit(
        book.coverUrl,
        `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_cover.jpg`,
        '/books/covers'
      );

      const videoUrl = await uploadToImageKit(
        book.videoUrl,
        `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_video.mp4`,
        '/books/videos'
      );

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      });

      console.log(`✅ Added: ${book.title}`);

      if (index < dummyBooks.length - 1) {
        await delay(300);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log(`✅ Total books seeded: ${dummyBooks.length}`);
  } catch (error) {
    console.error('❌ Error in seed process:', error);
    process.exit(1);
  }
};

seed();
