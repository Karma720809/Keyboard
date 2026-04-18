const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const posts = [];
const now = new Date();

for (let i = 1; i <= 300; i++) {
  // Spread the dates over the last 30 days
  const postDate = new Date(now.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
  posts.push({
    id: i.toString(),
    title: `키보드 타건감 질문 드립니다 - ${i}`,
    author: i % 5 === 0 ? '익명' : `User${i}`,
    content: `안녕하세요, 이번에 새로 나온 택타일 스위치를 써보려는데 궁금한 점이 있어서 글 남깁니다.\n타건음이 어떤가요? ${i}번째 고민중입니다.`,
    createdAt: postDate.toISOString()
  });
}

// Sort by date descending
posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(posts, null, 2));
console.log('Successfully generated 300 posts in src/data/posts.json');
