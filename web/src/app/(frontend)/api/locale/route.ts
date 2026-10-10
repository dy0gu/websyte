import { NextResponse } from 'next/server';
import { env } from '$/env';
import { isLocale, localeCookieMaxAge, localeCookieName } from '~/i18n/config';

export async function POST(request: Request): Promise<Response> {
  const { locale }: { locale?: unknown } = await request.json();
  if (typeof locale !== 'string' || !isLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: localeCookieMaxAge,
    path: '/',
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  });
  return response;
}
