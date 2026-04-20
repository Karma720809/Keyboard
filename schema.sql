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

-- ============================================================
-- 5. 상품 테이블 (Products) — 이커머스
-- ============================================================
CREATE TABLE products (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) UNIQUE NOT NULL,
    description      TEXT,
    price            NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),                    -- 정가 (할인 전 가격, optional)
    stock            INT DEFAULT 0,
    thumbnail_url    TEXT,                              -- Supabase Storage public URL
    images           TEXT[] DEFAULT '{}',              -- 추가 이미지 URL 배열
    category         VARCHAR(100),
    tags             TEXT[] DEFAULT '{}',
    is_published     BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 누구나 출시된 상품 조회 가능
CREATE POLICY "Public can read published products"
    ON products FOR SELECT
    USING (is_published = TRUE);

-- 관리자는 모든 상품 CRUD 가능
CREATE POLICY "Admins have full access to products"
    ON products
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.is_admin = TRUE
        )
    );

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- 인덱스
CREATE INDEX idx_products_slug        ON products(slug);
CREATE INDEX idx_products_published   ON products(is_published, created_at DESC);
CREATE INDEX idx_products_category    ON products(category);

-- ============================================================
-- 6. Supabase Storage — product-images 버킷 (수동 생성 필요)
-- ============================================================
-- Supabase 대시보드 > Storage > New Bucket
-- 버킷명: product-images
-- Public bucket: ✅ 활성화
-- 경로 규칙: thumbnails/{product_id}/{filename}
-- ============================================================
