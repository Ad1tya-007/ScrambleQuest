'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { words } from '@/app/words';
import { useToast } from '@/hooks/use-toast';

function scrambleWord(word: string): string {
  return word
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export default function WordScrambleGame() {
  const { toast } = useToast();

  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    newWord();
  }, []);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver]);

  const newWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord) {
      toast({
        title: 'Correct!',
        description: `You guessed the word "${currentWord}" correctly!`,
        variant: 'default',
        className: 'bg-green-500',
      });
      setScore((prevScore) => prevScore + 1);
      setGuess('');
      setTimer(20);
      newWord();
    } else {
      toast({
        title: 'Incorrect',
        description: 'Try again!',
        variant: 'destructive',
      });
    }
  };

  const handleEndGame = () => {
    setTimer(0);
  };

  const restartGame = () => {
    setScore(0);
    setTimer(30);
    setGameOver(false);
    setGuess('');
    newWord();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-primary">ScrambleQuest</h1>
      {!gameOver ? (
        <>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="text-3xl font-bold mb-6 text-center bg-primary/10 p-4 rounded">
              {scrambledWord}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your guess"
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Submit Guess
              </Button>
              <Button
                type="button"
                className="w-full"
                variant="secondary"
                onClick={handleEndGame}>
                End Game
              </Button>
            </form>
          </div>
          <div className="mt-6 text-xl">
            Score: {score} | Time:{' '}
            <span className={timer <= 10 ? 'text-red-500' : ''}>{timer}s</span>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-2">Your final score: {score}</p>
          <p className="text-lg mb-6">The word was: {currentWord}</p>
          <Button onClick={restartGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
