import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-gray-700">페이지를 찾을 수 없습니다</h2>
      <p className="mt-4 text-sm text-gray-500">
        요청하신 지역 또는 서비스 키워드가 유효하지 않거나 비활성화된 상태입니다.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        홈으로 이동
      </Link>
    </main>
  );
}
