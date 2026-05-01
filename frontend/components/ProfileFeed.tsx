'use client';

import React from 'react';
import ProfilePost from './ProfilePost';
import { QuestionCard } from './charcha/QuestionCard';

interface ProfileFeedProps {
  data: any[];
  activeTab?: 'posts' | 'questions';
}

export default function ProfileFeed({ data, activeTab = 'posts' }: ProfileFeedProps) {
  const isQuestions = activeTab === 'questions';

  return (
    <div className={isQuestions ? "p-4" : "grid grid-cols-3 gap-0.5"}>
      {data.map((item) => {
        if (isQuestions) {
          return (
            <QuestionCard 
              key={item.id}
              item={{
                id: item.id,
                user: item.username || 'User',
                question: item.caption,
                category: 'General',
                votes: item.likes || 0,
                answers: item.comments || 0,
                isAnsweredByExpert: false,
                time: 'Recently'
              }} 
            />
          );
        }

        return <ProfilePost key={item.id} {...item} />;
      })}
      
      {data.length === 0 && (
        <div className="col-span-3 py-20 flex flex-col items-center justify-center opacity-40">
           <p className="text-gray-500 font-bold">No {activeTab} yet</p>
        </div>
      )}
    </div>
  );
}
