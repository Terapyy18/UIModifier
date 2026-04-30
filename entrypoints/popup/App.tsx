import { useState, useEffect } from 'react';
import './App.css';
import { enabledItem, profilesItem } from '../../utils/storage';

interface ElementStyles {
  color: string;
  backgroundColor: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  padding: string;
  margin: string;
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  backgroundImage: string;
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  gap: string;
}

function App() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, Partial<ElementStyles>>>({});

  useEffect(() => {
    enabledItem.getValue().then(setIsEnabled);
    profilesItem.getValue().then(setProfiles);
  }, []);

  const toggleExtension = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    await enabledItem.setValue(newState);
  };

  const deleteProfile = async (name: string) => {
    const newProfiles = { ...profiles };
    delete newProfiles[name];
    setProfiles(newProfiles);
    await profilesItem.setValue(newProfiles);
  };

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>UI Modifier</h1>
        <div className="toggle-container">
          <span className="toggle-label">{isEnabled ? 'Enabled' : 'Disabled'}</span>
          <label className="switch">
            <input type="checkbox" checked={isEnabled} onChange={toggleExtension} />
            <span className="slider round"></span>
          </label>
        </div>
      </header>

      <div className="popup-content">
        <p className="description">
          Right-click on any element on the page to modify its styles dynamically.
        </p>

        <div className="profiles-section">
          <h2>Your Profiles</h2>
          {Object.keys(profiles).length === 0 ? (
            <p className="no-profiles">No profiles saved yet. Right-click an element and save its style to see it here.</p>
          ) : (
            <ul className="profile-list">
              {Object.keys(profiles).map(name => (
                <li key={name} className="profile-item">
                  <span className="profile-name">{name}</span>
                  <button 
                    onClick={() => deleteProfile(name)} 
                    className="delete-button"
                    title="Delete profile"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <footer className="popup-footer">
        <a href="https://github.com/Terapyy18/UIModifier" target="_blank" rel="noreferrer">
          View Documentation
        </a>
      </footer>
    </div>
  );
}

export default App;
