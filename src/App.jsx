import { useState, useEffect } from 'react';
import { round1_themes, theme_data } from './data';
import MatchUpView from './components/MatchUpView';
import MoodboardView from './components/MoodboardView';
import ThemeGridView from './components/ThemeGridView';

// Shuffle utility
const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Labels for rounds
const roundLabels = {
  1: 'Round 1 / 분위기',
  2: 'Round 2 / 질감',
  3: 'Round 3 / 조형',
  4: 'Round 4 / 빛과 컬러'
};

function App() {
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedThemeId, setSelectedThemeId] = useState(null);

  // currentPool holds the unplayed items in the current tier (e.g., 12 items -> 6 items -> 3 items -> ...)
  const [currentPool, setCurrentPool] = useState([]);
  const [nextTierPool, setNextTierPool] = useState([]);

  const [currentMatchUp, setCurrentMatchUp] = useState([]);
  const [finalImages, setFinalImages] = useState([]);

  // Animation state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize Round 1
  useEffect(() => {
    startRound(1, null);
  }, []);

  const startRound = (roundNum, themeId) => {
    let initialPool = [];
    if (roundNum === 1) {
      initialPool = shuffle(round1_themes);
    } else {
      const data = theme_data[themeId];
      if (roundNum === 2) initialPool = shuffle(data.round2_texture);
      else if (roundNum === 3) initialPool = shuffle(data.round3_shape);
      else if (roundNum === 4) initialPool = shuffle(data.round4_light);
    }

    setCurrentPool(initialPool);
    setNextTierPool([]);

    // Set first matchup (Only applies to rounds 2+)
    if (roundNum > 1) {
      if (initialPool.length >= 2) {
        setCurrentMatchUp([initialPool[0], initialPool[1]]);
      } else if (initialPool.length === 1) {
        // Edge case handler if needed
        handleRoundWinner(initialPool[0]);
      }
    }
  };

  const setNextMatchUpOrAdvance = (current, next) => {
    // We just processed 2 items from current pool.
    const remainingInCurrent = current.slice(2);

    if (remainingInCurrent.length >= 2) {
      // Still items left in current tier
      setCurrentPool(remainingInCurrent);
      setNextTierPool(next);
      setCurrentMatchUp([remainingInCurrent[0], remainingInCurrent[1]]);
    } else if (remainingInCurrent.length === 1) {
      // 1 item left - auto advance it to next tier
      const updatedNext = [...next, remainingInCurrent[0]];
      proceedToNextTier(updatedNext);
    } else {
      // 0 items left in current tier
      proceedToNextTier(next);
    }
  };

  const proceedToNextTier = (tierPool) => {
    // If the next tier only has 1 item, we found our round winner.
    if (tierPool.length === 1) {
      handleRoundWinner(tierPool[0]);
    } else {
      // Otherwise, start the next tier
      setCurrentPool(tierPool);
      setNextTierPool([]);
      setCurrentMatchUp([tierPool[0], tierPool[1]]);
    }
  };

  const handleRoundWinner = (winnerItem) => {
    setFinalImages(prev => [...prev, winnerItem]);

    const nextRound = currentRound + 1;
    let themeId = selectedThemeId;

    if (currentRound === 1) {
      themeId = winnerItem.id;
      setSelectedThemeId(themeId);
    }

    setCurrentRound(nextRound);

    if (nextRound <= 4) {
      startRound(nextRound, themeId);
    }
    // If nextRound > 4, we render the Moodboard View (handled in JSX)
  };

  const onSelectImage = (winner) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      const newNextTierPool = [...nextTierPool, winner];
      setNextMatchUpOrAdvance(currentPool, newNextTierPool);
      setIsTransitioning(false);
    }, 400); // Wait for animation
  };

  const handleRestart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setFinalImages([]);
      setSelectedThemeId(null);
      setCurrentRound(1);
      startRound(1, null);
      setIsTransitioning(false);
    }, 400);
  };

  if (currentRound > 4) {
    return (
      <div className={`fade-in ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ width: '100%', height: '100%', transition: 'opacity 0.3s' }}>
        <MoodboardView finalImages={finalImages} onRestart={handleRestart} />
      </div>
    );
  }

  // Round 1: Grid View
  if (currentRound === 1) {
    return (
      <div className="app-container" style={{ overflowY: 'auto' }}>
        <header className="app-header">
          <div className="brand-logo">브랜드 이미지 월드컵</div>
          <div className="round-indicator">
            {roundLabels[currentRound]}
          </div>
        </header>

        <div className={`fade-in ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ width: '100%', minHeight: '100%', transition: 'opacity 0.3s' }}>
          <ThemeGridView
            themes={currentPool}
            onSelect={(winner) => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setTimeout(() => {
                handleRoundWinner(winner);
                setIsTransitioning(false);
              }, 400);
            }}
          />
        </div>
      </div>
    );
  }

  // Not loaded yet for MatchUp
  if (currentMatchUp.length < 2) return null;

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ flex: 1 }}></div>
        <div className="round-indicator">
          {roundLabels[currentRound]}
        </div>
      </header>

      <div className={`matchup-wrapper fade-in ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ width: '100%', height: '100%', transition: 'opacity 0.3s' }}>
        <MatchUpView
          image1={currentMatchUp[0]}
          image2={currentMatchUp[1]}
          onSelect={onSelectImage}
        />
      </div>
    </div>
  );
}

export default App;
