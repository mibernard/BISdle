import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        color: '#cdbe91',
        padding: '40px 20px',
        fontFamily: 'Marcellus SC'
      }}
    >
      <Head>
        <title>About BISdle - TFT Champion Guessing Game</title>
        <meta
          name='description'
          content='Learn more about BISdle, a free-to-play Teamfight Tactics champion guessing game. Test your TFT knowledge daily!'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href='/'>
          <a
            style={{
              color: '#cdbe91',
              textDecoration: 'none',
              fontSize: '16px',
              marginBottom: '20px',
              display: 'inline-block'
            }}
          >
            ← Back to Game
          </a>
        </Link>

        <h1
          style={{
            textAlign: 'center',
            fontSize: '3rem',
            marginBottom: '40px',
            letterSpacing: '2px'
          }}
        >
          About BISdle
        </h1>

        <section style={{ marginBottom: '40px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>What is BISdle?</h2>
          <p style={{ fontSize: '1.1rem' }}>
            BISdle is a free-to-play web-based guessing game for Teamfight Tactics (TFT) fans. Challenge yourself to
            identify TFT champions based on their Best-In-Slot (BIS) items. The game pulls real match data from
            high-ranked players to show you the most popular items for each champion in the current meta.
          </p>
        </section>

        <section style={{ marginBottom: '60px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>How to Play</h2>
          <ul style={{ fontSize: '1.1rem', paddingLeft: '20px', margin: '0 0 20px 0' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Daily Mode:</strong> Guess the daily champion - everyone gets the same champion each day. Your
              progress saves automatically, so you can come back anytime.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Unlimited Mode:</strong> Practice as much as you want with random champions. Perfect your skills
              and learn the meta!
            </li>
            <li style={{ marginBottom: '10px' }}>
              Use hints to reveal a champion's class, or reveal the answer if you're stuck.
            </li>
            <li style={{ marginBottom: '0' }}>
              Track your statistics including games played, win streaks, and guess distribution.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px', lineHeight: '1.8', clear: 'both' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Data Source</h2>
          <p style={{ fontSize: '1.1rem' }}>
            BISdle uses real match data from the Riot Games API, analyzing games from high-ranked TFT players. The item
            recommendations are based on actual gameplay data, showing you what top players are building on each
            champion. Data updates automatically to reflect the current meta.
          </p>
        </section>

        <section style={{ marginBottom: '40px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Support the Project</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            BISdle is completely free to play with no ads or paywalls. If you enjoy the game and would like to support
            ongoing development and server costs, you can buy me a coffee through Ko-fi. Your support helps keep the
            game running and allows me to continue adding new features and maintaining the game for each TFT set.
          </p>
          <div style={{ textAlign: 'center' }}>
            <a href='https://ko-fi.com/J3J51MVB8P' target='_blank' rel='noopener noreferrer'>
              <img
                height='36'
                style={{ border: '0px', height: '40px' }}
                src='https://storage.ko-fi.com/cdn/kofi6.png?v=6'
                border='0'
                alt='Support me on Ko-fi'
              />
            </a>
          </div>
        </section>

        <section style={{ marginBottom: '40px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Technology</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Built with Next.js, React, and the Riot Games API. Champion and item images are provided by Riot Games' Data
            Dragon CDN. All match data is fetched in real-time from live games.
          </p>
        </section>

        <section style={{ marginBottom: '40px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Contact & Feedback</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Have suggestions, found a bug, or want to contribute? Reach out through GitHub or LinkedIn - links are in
            the footer below. I'm always looking to improve the game and welcome community feedback!
          </p>
        </section>

        <section style={{ marginBottom: '40px', lineHeight: '1.8', fontSize: '0.9rem', opacity: 0.8 }}>
          <p>
            BISdle is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone
            officially involved in producing or managing Riot Games properties. Riot Games and all associated properties
            are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </section>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link href='/'>
            <a
              style={{
                color: '#cdbe91',
                textDecoration: 'none',
                fontSize: '1.2rem',
                padding: '15px 30px',
                border: '2px solid #cdbe91',
                borderRadius: '8px',
                display: 'inline-block',
                transition: 'all 0.3s'
              }}
            >
              Play Now →
            </a>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
