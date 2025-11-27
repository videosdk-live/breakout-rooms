import React from 'react';

const VideoStatsTable = ({ videoStats }) => {
//   console.log("Getting videoStats: ", videoStats);

  if (!videoStats.length || !videoStats[0]) {
    return <p>No stats available.</p>;
  }

  const statsObject = videoStats[0];

  return (
    <table
      border="1"
      style={{
        width: 'auto',
        margin: '5px',
        fontSize: '12px',
        borderCollapse: 'collapse',
      }}
    >
      <thead>
        <tr>
          <th style={{ padding: '2px 4px' }}>Key</th>
          <th style={{ padding: '2px 4px' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(statsObject).map(([key, value]) => (
          <tr key={key}>
            <td style={{ padding: '2px 4px' }}>{key}</td>
            <td style={{ padding: '2px 4px' }}>
              {typeof value === 'object' ? JSON.stringify(value) : value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VideoStatsTable;
