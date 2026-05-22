import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { setChannels, setLoading, setError } from './store/channelsSlice';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import ChannelsPage from './pages/ChannelsPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const CONFIG_URL = 'https://raw.githubusercontent.com/lackwidow/Omnipotent-TV-STREAM-/main/config/channels.json';

interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string;
  group: string;
}

function AppContent() {
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.channels.loading);
  const error = useSelector((state: any) => state.channels.error);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        dispatch(setLoading(true));

        const cached = localStorage.getItem('channels_cache');
        const cachedTime = localStorage.getItem('channels_cache_time');
        const now = Date.now();

        const configRes = await fetch(CONFIG_URL);
        if (!configRes.ok) throw new Error('Failed to fetch config');
        const config = await configRes.json();
        const cacheHours = config.cache_hours || 6;

        if (cached && cachedTime && now - parseInt(cachedTime) < cacheHours * 60 * 60 * 1000) {
          dispatch(setChannels(JSON.parse(cached)));
          dispatch(setLoading(false));
          return;
        }

        const m3uRes = await fetch(config.playlist_url);
        if (!m3uRes.ok) throw new Error('Failed to fetch playlist');
        const m3uText = await m3uRes.text();
        const channels = parseM3U(m3uText);

        localStorage.setItem('channels_cache', JSON.stringify(channels));
        localStorage.setItem('channels_cache_time', now.toString());

        dispatch(setChannels(channels));
      } catch (err: any) {
        dispatch(setError(err.message));
        console.error('Failed to load channels:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadChannels();
  }, [dispatch]);

  if (loading) return <div className="loading">Loading channels...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

function parseM3U(m3uText: string): Channel[] {
  const lines = m3uText.split('\n');
  const channels: Channel[] = [];
  let name = '', logo = '', group = '';

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF')) {
      name = line.split(',').pop()?.trim() || 'Unknown';
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      logo = logoMatch? logoMatch[1] : '';
      const groupMatch = line.match(/group-title="(.*?)"/);
      group = groupMatch? groupMatch[1] : 'Other';
    } else if (line.startsWith('http')) {
      channels.push({
        id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: name.trim(),
        url: line.trim(),
        logo: logo,
        group: group
      });
      name = logo = group = '';
    }
  }
  return channels;
}

export default App;        const config = await configRes.json();
        const cacheHours = config.cache_hours || 6;

        if (cached && cachedTime && now - parseInt(cachedTime) < cacheHours * 60 * 60 * 1000) {
          dispatch(setChannels(JSON.parse(cached)));
          dispatch(setLoading(false));
          return;
        }

        const m3uRes = await fetch(config.playlist_url);
        const m3uText = await m3uRes.text();
        const channels = parseM3U(m3uText);

        localStorage.setItem('channels_cache', JSON.stringify(channels));
        localStorage.setItem('channels_cache_time', now.toString());
        
        dispatch(setChannels(channels));
      } catch (err: any) {
        dispatch(setError(err.message));
        console.error('Failed to load channels:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadChannels();
  }, [dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/channels" element={<ChannelsPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

function parseM3U(m3uText: string): Channel[] {
  const lines = m3uText.split('\n');
  const channels: Channel[] = [];
  let name = '', logo = '', group = '';

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF')) {
      name = line.split(',').pop()?.trim() || 'Unknown';
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      logo = logoMatch? logoMatch[1] : '';
      const groupMatch = line.match(/group-title="(.*?)"/);
      group = groupMatch? groupMatch[1] : 'Other';
    } else if (line.startsWith('http')) {
      channels.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name.trim(),
        url: line.trim(),
        logo: logo,
        group: group
      });
      name = logo = group = '';
    }
  }
  return channels;
}

export default App;
