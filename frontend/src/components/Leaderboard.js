'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';

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
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/leaderboard`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeaderboard(data);
        }
      })
      .catch(err => console.error("Failed to fetch leaderboard:", err));
  }, []);

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
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-tertiary)' }}>
            Belum ada user di leaderboard. Jadilah yang pertama!
          </div>
        ) : leaderboard.map((user, index) => (
          <div
            key={user.user_id}
            className="leaderboard-item"
            id={`leaderboard-item-${user.user_id}`}
          >
            <span className={`leaderboard-rank ${getRankClass(index)}`}>
              {index + 1}
            </span>
            <div className="leaderboard-avatar">
              {getInitials(user.display_name || user.username)}
            </div>
            <div className="leaderboard-info">
              <div className="leaderboard-name">{user.display_name || user.username}</div>
            </div>
            <span className="leaderboard-points">
              {formatPoints(user.total_points)} {t('common.points')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
