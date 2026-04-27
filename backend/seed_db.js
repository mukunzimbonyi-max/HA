const { pool } = require('./db');

const seedDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Seeding database with medical facilities...');
    
    // Clear existing facilities
    await client.query('DELETE FROM facilities');

    const facilities = [
      {
        name: 'Kigali City Pharmacy',
        type: 'pharmacy',
        address: 'KN 2 Ave, Kigali',
        lat: -1.9441,
        lng: 30.0619,
        phone: '+250 788 000 000',
        hours: '24/7'
      },
      {
        name: 'King Faisal Hospital',
        type: 'hospital',
        address: 'KG 544 St, Kigali',
        lat: -1.9413,
        lng: 30.0934,
        phone: '+250 252 588 888',
        hours: '24/7'
      },
      {
        name: 'Gikondo Health Center',
        type: 'hospital',
        address: 'Gikondo, Kigali',
        lat: -1.9700,
        lng: 30.0700,
        phone: '+250 788 111 222',
        hours: '08:00 - 20:00'
      },
      {
        name: 'Trust Pharmacy',
        type: 'pharmacy',
        address: 'Kimironko Road, Kigali',
        lat: -1.9350,
        lng: 30.1250,
        phone: '+250 788 333 444',
        hours: '07:00 - 22:00'
      }
    ];

    for (const f of facilities) {
      await client.query(
        'INSERT INTO facilities (name, type, address, latitude, longitude, phone, opening_hours) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [f.name, f.type, f.address, f.lat, f.lng, f.phone, f.hours]
      );
    }

    // Seed some videos too
    await client.query('DELETE FROM videos');
    const videos = [
      {
        title: 'Safe Practices for Youth',
        desc: 'Learn about protection and safe choices.',
        url: 'https://example.com/video1',
        lang: 'en'
      },
      {
        title: 'Uburyo bwo kwirinda SIDA',
        desc: 'Ubumenyi ku bijyanye no kwirinda.',
        url: 'https://example.com/video2',
        lang: 'rw'
      }
    ];

    for (const v of videos) {
      await client.query(
        'INSERT INTO videos (title, description, url, language) VALUES ($1, $2, $3, $4)',
        [v.title, v.desc, v.url, v.lang]
      );
    }

    // Seed cohorts
    await client.query('DELETE FROM cohorts');
    const cohorts = [
      { name: 'SRH Empowerment Cohort 1', desc: 'Comprehensive SRH education for youth.', date: '2024-06-01' },
      { name: 'Mental Health Resilience', desc: 'Building emotional strength and support systems.', date: '2024-07-15' },
      { name: 'Healthy Relationships', desc: 'Navigating boundaries and communication.', date: '2024-08-20' }
    ];

    for (const c of cohorts) {
      await client.query(
        'INSERT INTO cohorts (name, description, start_date) VALUES ($1, $2, $3)',
        [c.name, c.desc, c.date]
      );
    }

    // Seed updates
    await client.query('DELETE FROM updates');
    const updates = [
      {
        title: 'Biannual Masterclass Registration Open',
        content: 'Our next cohort on SRH and Mental Health is now accepting registrations. Join over 500 youth across Rwanda.',
        file_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
      },
      {
        title: 'New Partner Clinics in Kigali',
        content: 'We are excited to announce 5 new clinics joining our GPS directory this month to provide better services.',
        file_url: null
      }
    ];

    for (const u of updates) {
      await client.query(
        'INSERT INTO updates (title, content, file_url) VALUES ($1, $2, $3)',
        [u.title, u.content, u.file_url]
      );
    }

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    client.release();
  }
};

if (require.main === module) {
  seedDb().then(() => process.exit());
}

module.exports = seedDb;
