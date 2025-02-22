import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Album } from '@/types/album'

const albumsDirectory = path.join(process.cwd(), 'src/content/albums')

export function getAllAlbums(): Album[] {
  const fileNames = fs.readdirSync(albumsDirectory);
  return fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(albumsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const date = matterResult.data.date
      ? new Date(matterResult.data.date).toISOString().split('T')[0]
      : '';

    const images = matterResult.content
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const match = line.match(/\[(.*?)\]\((.*?)\)/);
        return match
          ? { title: match[1], url: match[2] }
          : { title: '', url: '' };
      })
      .filter(image => image.url); 

    const coverImage = matterResult.data.coverImage;

    return {
      id,
      name: matterResult.data.name || '',
      date,
      description: matterResult.data.description || '',
      coverImage,
      images,
    };
  });
}

export function getAlbumById(id: string): Album | undefined {
  const albums = getAllAlbums()
  return albums.find(album => album.id === id)
}

export function searchAlbums(query: string): Album[] {
  const albums = getAllAlbums()
  return albums.filter(album => 
    album.name.toLowerCase().includes(query.toLowerCase()) ||
    album.description.toLowerCase().includes(query.toLowerCase())
  )
}