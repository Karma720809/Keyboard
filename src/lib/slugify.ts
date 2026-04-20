/**
 * 상품 슬러그 생성 유틸 (서버/클라이언트 공용)
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-가-힣]/g, '')
    .replace(/--+/g, '-')
    .trim()
}
