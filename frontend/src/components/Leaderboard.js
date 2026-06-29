'use client';

import { useState } from 'react';
import { useI18n } from '../context/I18nContext';

// Sample leaderboard data (in production, fetched from API)
const MOCK_LEADERBOARD = [
  { id: '1', username: 'shadowbyte', displayName: 'ShadowByte', points: 12450, modulesCompleted: 48, labsCompleted: 32 },
  { id: '2', username: 'cipherx', displayName: 'CipherX', points: 11280, modulesCompleted: 45, labsCompleted: 28 },
  { id: '3', username: 'n0xpl0it', displayName: 'N0xPl0it', points: 10890, modulesCompleted: 42, labsCompleted: 30 },
  { id: '4', username: 'algo_queen', displayName: 'AlgoQueen', points: 9750, modulesCompleted: 40, labsCompleted: 22 },
  { id: '5', username: 'kernelpanic', displayName: 'KernelPanic', points: 9320, modulesCompleted: 38, labsCompleted: 25 },
  { id: '6', username: 'rootkit42', displayName: 'RootKit42', points: 8890, modulesCompleted: 35, labsCompleted: 24 },
  { id: '7', username: 'bytecrusher', displayName: 'ByteCrusher', points: 8450, modulesCompleted: 33, labsCompleted: 20 },
  { id: '8', username: 'zeroshell', displayName: 'ZeroShell', points: 7920, modulesCompleted: 30, labsCompleted: 18 },
];

function getRankClass(index) {
  if (index === 0) return 'leaderboard-rank-1';
  if (index === 1) return 'leaderboard-rank-2';
  if (index === 2) return 'leaderboard-rank-3';
  return 'leaderboard-rank-default';
}

function getInitials(name) {
  return name.slice(0, 2).toUpperCase();
}

function formatPoints(points) {
  if (points >= 1000) {
    return (points / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return points.toString();
}

export default function Leaderboard() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('weekly');

  const tabs = [
    { key: 'weekly', label: t('leaderboard.weekly') },
    { key: 'monthly', label: t('leaderboard.monthly') },
    { key: 'allTime', label: t('leaderboard.allTime') },
  ];

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3 className="leaderboard-title">{t('leaderboard.title')}</h3>
        <div className="leaderboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`leaderboard-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              id={`leaderboard-tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="leaderboard-list stagger-children">
        {MOCK_LEADERBOARD.map((user, index) => (
          <div
            key={user.id}
            className="leaderboard-item"
            id={`leaderboard-item-${user.id}`}
          >
            <span className={`leaderboard-rank ${getRankClass(index)}`}>
              {index + 1}
            </span>
            <div className="leaderboard-avatar">
              {getInitials(user.displayName)}
            </div>
            <div className="leaderboard-info">
              <div className="leaderboard-name">{user.displayName}</div>
            </div>
            <span className="leaderboard-points">
              {formatPoints(user.points)} {t('common.points')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
