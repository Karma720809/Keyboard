-- 자유게시판 및 커뮤니티 확장을 고려한 DB 스키마 (PostgreSQL 기준)

-- 1. 사용자 테이블 (Supabase Auth와 연동되는 프로필 테이블)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 가입 시 자동 동기화 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'first_name', 
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. 게시판 카테고리 (자유게시판, 질문게시판, 팁/강좌 등 확장)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 3. 게시글 테이블 (Posts)
-- 비회원 작성자(author_name)와 회원(user_id)을 모두 지원하는 구조
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- null이면 비회원/익명
    author_name VARCHAR(100) DEFAULT '익명', -- 작성 시 입력받은 이름
    password_hash VARCHAR(255), -- 비회원 글 수정/삭제를 위한 비밀번호
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 댓글 테이블 (Comments)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id INT REFERENCES comments(id) ON DELETE CASCADE, -- 대댓글 지원
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) DEFAULT '익명',
    password_hash VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX idx_posts_category_created ON posts(category_id, created_at DESC);
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at ASC);
