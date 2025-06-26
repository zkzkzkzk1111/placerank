import { NextResponse } from 'next/server';
import { getRanksUseCase } from '@/data/di';

export async function GET() {
  const ranks = await getRanksUseCase.execute();
  return NextResponse.json(ranks);
}