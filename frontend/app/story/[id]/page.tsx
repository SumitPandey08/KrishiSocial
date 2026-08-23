'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import StoryViewer from '@/components/StoryViewer';

export default function StoryPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) return null;

  return <StoryViewer initialStoryId={id} />;
}
