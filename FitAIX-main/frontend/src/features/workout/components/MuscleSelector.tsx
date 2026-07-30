import React, { useState, useRef, useEffect } from 'react';
import './MuscleSelector.css';

interface MuscleSelectorProps {
    onSelectMuscle: (muscle: string) => void;
}

export const MuscleSelector: React.FC<MuscleSelectorProps> = ({ onSelectMuscle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMuscle, setSelectedMuscle] = useState('Select Target Muscle Group');
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const muscles = [
        'Chest (Push Focus)',
        'Shoulders / OHP',
        'Triceps / Arms',
        'Core & Abs',
        'Back / Pull Focus',
        'Quadriceps / Legs',
        'Hamstrings & Glutes',
        'Calves'
    ];

    const filteredMuscles = muscles.filter(m =>
        m.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="muscle-dropdown-wrapper" ref={dropdownRef}>
            <button
                className="muscle-dropdown-btn"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="selected-text">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00F2FE' }}>
                        <path d="M6.5 6.5h11M6.5 17.5h11M5 12h14" />
                    </svg>
                    {selectedMuscle}
                </span>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="muscle-dropdown-menu active">
                    <div className="dropdown-search-wrapper">
                        <input
                            type="text"
                            className="dropdown-search"
                            placeholder="Search muscle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="dropdown-options">
                        {filteredMuscles.map((muscle) => (
                            <div
                                key={muscle}
                                className={`dropdown-option ${selectedMuscle === muscle ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedMuscle(muscle);
                                    onSelectMuscle(muscle);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                            >
                                {muscle}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};