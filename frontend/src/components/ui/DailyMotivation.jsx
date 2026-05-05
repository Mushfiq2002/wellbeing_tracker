import React, { useState, useEffect } from 'react';

const quotes = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "It's hard to beat a person who never gives up. - Babe Ruth",
  "I wake up every morning and think to myself, 'How far can I push this company in the next 24 hours.' - Leah Busque",
  "If people are doubting how far you can go, go so far that you can't hear them anymore. - Michele Ruiz",
  "We need to accept that we won't always make the right decisions, that we'll screw up royally sometimes - understanding that failure is not the opposite of success, it's part of success. - Arianna Huffington",
  "Write it. Shoot it. Publish it. Crochet it, sauté it, whatever. MAKE. - Joss Whedon",
  "You've gotta dance like there's nobody watching, love like you'll never be hurt, sing like there's nobody listening, and live like it's heaven on earth. - William W. Purkey",
  "Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten. - Neil Gaiman",
  "Everything you can imagine is real. - Pablo Picasso",
  "When one door of happiness closes, another opens; but often we look so long at the closed door that we do not see the one which has been opened for us. - Helen Keller",
  "Do one thing every day that scares you. - Eleanor Roosevelt",
  "It's no use going back to yesterday, because I was a different person then. - Lewis Carroll",
  "Smart people learn from everything and everyone, average people from their experiences, stupid people already have all the answers. - Socrates",
  "Do what you feel in your heart to be right - for you'll be criticized anyway. - Eleanor Roosevelt",
  "Happiness is not something ready made. It comes from your own actions. - Dalai Lama XIV",
  "Whatever you are, be a good one. - Abraham Lincoln",
  "The same boiling water that softens the potato hardens the egg. It's what you're made of. Not the circumstances. - Unknown",
  "If we have the attitude that it's going to be a great day it usually is. - Catherine Pulsifer",
  "You can either experience the pain of discipline or the pain of regret. The choice is yours. - Unknown",
  "Impossible is just an opinion. - Paulo Coelho",
  "Your passion is waiting for your courage to catch up. - Isabelle Lafleche",
  "Magic is believing in yourself, if you can do that, you can make anything happen. - Johann Wolfgang von Goethe",
  "If it matters to you, you'll find a way. - Charlie Gilkey",
  "Focus on the step in front of you, not the whole staircase. - Unknown",
  "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
  "A winner is a dreamer who never gives up. - Nelson Mandela"
];

const DailyMotivation = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('dailyMotivationDate');
    const storedQuote = localStorage.getItem('dailyMotivationQuote');

    if (storedDate === today && storedQuote) {
      setQuote(storedQuote);
    } else {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const newQuote = quotes[randomIndex];
      setQuote(newQuote);
      localStorage.setItem('dailyMotivationDate', today);
      localStorage.setItem('dailyMotivationQuote', newQuote);
    }
  }, []);

  if (!quote) return null;

  const [text, author] = quote.split(' - ');

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <svg className="w-8 h-8 text-indigo-200 mb-3 opacity-75" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-lg md:text-xl font-medium leading-relaxed mb-4 italic">
          "{text}"
        </p>
        <div className="h-px w-16 bg-indigo-300 opacity-50 mb-4"></div>
        <p className="text-sm font-semibold text-indigo-100 tracking-wider uppercase">
          {author || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default DailyMotivation;
