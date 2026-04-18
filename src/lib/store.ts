import fs from 'fs';
import path from 'path';

export interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
}

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'posts.json');

function readPosts(): Post[] {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const fileData = fs.readFileSync(dataFilePath, 'utf-8');
  try {
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error parsing posts.json:", error);
    return [];
  }
}

function writePosts(posts: Post[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}

export async function getPosts(page: number = 1, limit: number = 20) {
  const posts = readPosts();
  const total = posts.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    items: posts.slice(start, end),
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getPost(id: string): Promise<Post | undefined> {
  const posts = readPosts();
  return posts.find(p => p.id === id);
}

export async function createPost(data: Omit<Post, 'id' | 'createdAt'>) {
  const posts = readPosts();
  const newPost: Post = {
    ...data,
    id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
    createdAt: new Date().toISOString()
  };
  
  posts.unshift(newPost); // Add to top
  writePosts(posts);
  return newPost;
}
