import React, { useState, useEffect } from 'react'

function MyJournal({ user }) {
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal/entries', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (err) {
      setError('Failed to load journal entries')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newEntry.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          content: newEntry,
          date: new Date().toISOString()
        })
      })

      if (response.ok) {
        const newEntryData = await response.json()
        setEntries([newEntryData, ...entries])
        setNewEntry('')
      } else {
        setError('Failed to save journal entry')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="journal-container">
        <p>Please log in to access your journal.</p>
      </div>
    )
  }

  return (
    <div className="journal-container">
      <h2>My Pregnancy Journal</h2>
      
      <form onSubmit={handleSubmit} className="new-entry-form">
        <div className="form-group">
          <label htmlFor="newEntry">New Journal Entry:</label>
          <textarea
            id="newEntry"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Share your thoughts, feelings, or experiences..."
            rows="4"
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Saving...' : 'Add Entry'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="entries-section">
        <h3>Your Journal Entries</h3>
        {entries.length === 0 ? (
          <p className="no-entries">No journal entries yet. Start writing!</p>
        ) : (
          <div className="entries-list">
            {entries.map((entry, index) => (
              <div key={entry.id || index} className="journal-entry">
                <div className="entry-date">
                  {new Date(entry.date || Date.now()).toLocaleDateString()}
                </div>
                <div className="entry-content">
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyJournal