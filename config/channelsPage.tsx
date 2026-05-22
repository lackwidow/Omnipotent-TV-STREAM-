import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

export default function ChannelsPage() {
  const channels = useSelector((state: RootState) => state.channels.list);

  return (
    <div className="channels-grid">
      {channels.map(channel => (
        <Link key={channel.id} to={`/player/${channel.id}`} className="channel-card">
          <img src={channel.logo} alt={channel.name} />
          <span>{channel.name}</span>
        </Link>
      ))}
    </div>
  );
          }
