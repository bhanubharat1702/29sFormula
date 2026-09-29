import RegisterPageClient from './RegisterPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default async function RegisterPage() {
  let primaryColor = "";
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.primaryColor) {
        primaryColor = data.primaryColor;
      }
    }
  } catch (e) {
    // silently fail and fallback to default color
  }

  return <RegisterPageClient initialColor={primaryColor || "#ffffff"} />;
}
