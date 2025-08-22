// Sound Experience Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Audio objects to store each sound
    const audioSources = {
        rainfall: null,
        waves: null,
        wind: null,
        crickets: null,
        fireplace: null,
        vinyl: null
    };
    
    // Initialize audio mixer
    function initializeAudioMixer() {
        const playButtons = document.querySelectorAll('.play-button');
        const volumeSliders = document.querySelectorAll('.volume-slider');
        
        // Local audio file URLs
        const audioUrls = {
            rainfall: './Sounds/rainfall.mp3',
            waves: './Sounds/waves.mp3', 
            wind: './Sounds/wind.mp3',
            crickets: './Sounds/cricket.mp3',
            fireplace: './Sounds/fireplace.mp3',
            vinyl: './Sounds/vinyl.wav'
        };
        
        // Create audio objects with local files
        Object.keys(audioSources).forEach(audioType => {
            audioSources[audioType] = new Audio();
            audioSources[audioType].src = audioUrls[audioType];
            audioSources[audioType].loop = true;
            audioSources[audioType].volume = 0;
            audioSources[audioType].preload = 'auto';
            
            // Add error handling
            audioSources[audioType].addEventListener('error', function(e) {
                console.error(`Error loading audio file for ${audioType}:`, e);
            });
            
            // Add loaded event
            audioSources[audioType].addEventListener('loadeddata', function() {
                console.log(`Audio file loaded for ${audioType}`);
            });
        });
        
        // Play button functionality (following audio.html pattern)
        playButtons.forEach(button => {
            button.addEventListener('click', function() {
                const audioType = this.getAttribute('data-audio');
                const audio = audioSources[audioType];
                const slider = document.querySelector(`input[data-audio="${audioType}"]`);
                
                if (audio.paused) {
                    // Try to play audio with user interaction requirement handling
                    const playPromise = audio.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            // Audio started playing successfully
                            this.textContent = '⏸';
                            this.classList.add('playing');
                            
                            // Set volume to slider value if not zero
                            if (slider.value > 0) {
                                audio.volume = slider.value / 100;
                            } else {
                                slider.value = 50;
                                audio.volume = 0.5;
                                updateVolumeIndicator(slider);
                            }
                        }).catch(error => {
                            console.error(`Audio play failed for ${audioType}:`, error);
                            // Reset button state if play failed
                            this.textContent = '▶';
                            this.classList.remove('playing');
                        });
                    }
                } else {
                    // Pause audio (following audio.html pattern)
                    audio.pause();
                    this.textContent = '▶';
                    this.classList.remove('playing');
                }
            });
        });
        
        // Volume slider functionality (following audio.html pattern)
        volumeSliders.forEach(slider => {
            slider.addEventListener('input', function() {
                const audioType = this.getAttribute('data-audio');
                const audio = audioSources[audioType];
                const volume = this.value / 100; // Convert 0-100 to 0-1 like audio.html
                
                // Set audio volume directly like in audio.html
                audio.volume = volume;
                updateVolumeIndicator(this);
                
                // Auto-play when volume is increased from 0 (enhanced behavior)
                if (volume > 0 && audio.paused) {
                    const playButton = document.querySelector(`button[data-audio="${audioType}"]`);
                    const playPromise = audio.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            playButton.textContent = '⏸';
                            playButton.classList.add('playing');
                        }).catch(error => {
                            console.error(`Auto-play failed for ${audioType}:`, error);
                        });
                    }
                }
                
                // Auto-pause when volume is 0
                if (volume === 0 && !audio.paused) {
                    const playButton = document.querySelector(`button[data-audio="${audioType}"]`);
                    audio.pause();
                    playButton.textContent = '▶';
                    playButton.classList.remove('playing');
                }
            });
            
            // Initialize volume indicators
            updateVolumeIndicator(slider);
        });
    }
    
    // Update volume indicator visual
    function updateVolumeIndicator(slider) {
        const indicator = slider.parentElement.querySelector('.volume-indicator');
        const percentage = slider.value;
        indicator.style.width = percentage + '%';
    }
    
    // Add audio loading status tracking
    function checkAudioLoadingStatus() {
        let loadedCount = 0;
        const totalAudios = Object.keys(audioSources).length;
        
        Object.keys(audioSources).forEach(audioType => {
            const audio = audioSources[audioType];
            
            audio.addEventListener('canplaythrough', function() {
                loadedCount++;
                console.log(`${audioType} ready to play (${loadedCount}/${totalAudios})`);
                
                if (loadedCount === totalAudios) {
                    console.log('All audio files loaded successfully');
                    // Optional: Show a "ready" indicator to user
                }
            });
            
            audio.addEventListener('error', function(e) {
                console.error(`Failed to load ${audioType}:`, e);
                // Optional: Show error to user or disable that audio control
            });
        });
    }
    
    // Fade in/out animations
    function setupAnimations() {
        const audioItems = document.querySelectorAll('.audio-item');
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'all 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        }, { threshold: 0.2 });
        
        audioItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // Master Controls Setup
    function setupMasterControls() {
        const pauseAllButton = document.querySelector('.pause-all-button');
        const resetAllButton = document.querySelector('.reset-all-button');
        
        // Pause Everything functionality
        if (pauseAllButton) {
            let isPaused = false;
            
            pauseAllButton.addEventListener('click', function() {
                if (!isPaused) {
                    // Pause all playing audio
                    Object.keys(audioSources).forEach(audioType => {
                        const audio = audioSources[audioType];
                        const playButton = document.querySelector(`button[data-audio="${audioType}"]`);
                        
                        if (audio && !audio.paused) {
                            audio.pause();
                            playButton.textContent = '▶';
                            playButton.classList.remove('playing');
                        }
                    });
                    
                    this.textContent = 'Resume All';
                    this.classList.add('paused');
                    isPaused = true;
                } else {
                    // Resume all audio that has volume > 0
                    Object.keys(audioSources).forEach(audioType => {
                        const audio = audioSources[audioType];
                        const playButton = document.querySelector(`button[data-audio="${audioType}"]`);
                        const slider = document.querySelector(`input[data-audio="${audioType}"]`);
                        
                        if (audio && audio.paused && slider.value > 0) {
                            const playPromise = audio.play();
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    playButton.textContent = '⏸';
                                    playButton.classList.add('playing');
                                }).catch(error => {
                                    console.error(`Resume failed for ${audioType}:`, error);
                                });
                            }
                        }
                    });
                    
                    this.textContent = 'Pause Everything';
                    this.classList.remove('paused');
                    isPaused = false;
                }
            });
        }
        
        // Reset functionality
        if (resetAllButton) {
            resetAllButton.addEventListener('click', function() {
                // Stop and reset all audio
                Object.keys(audioSources).forEach(audioType => {
                    const audio = audioSources[audioType];
                    const playButton = document.querySelector(`button[data-audio="${audioType}"]`);
                    const slider = document.querySelector(`input[data-audio="${audioType}"]`);
                    
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.volume = 0;
                    }
                    
                    if (playButton) {
                        playButton.textContent = '▶';
                        playButton.classList.remove('playing');
                    }
                    
                    if (slider) {
                        slider.value = 0;
                        updateVolumeIndicator(slider);
                    }
                });
                
                // Reset pause button if it was in paused state
                if (pauseAllButton) {
                    pauseAllButton.textContent = 'Pause Everything';
                    pauseAllButton.classList.remove('paused');
                }
                
                // Add visual feedback
                this.textContent = 'Reset Complete!';
                setTimeout(() => {
                    this.textContent = 'Reset';
                }, 1000);
            });
        }
    }
    
    // Initialize everything
    initializeAudioMixer();
    checkAudioLoadingStatus();
    setupAnimations();
    setupMasterControls();
    
    // Cleanup function to stop all audio when leaving page (following audio.html cleanup pattern)
    window.addEventListener('beforeunload', function() {
        Object.values(audioSources).forEach(audio => {
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0; // Reset like in audio.html stop function
            }
        });
    });
    
    // Add stop all functionality (bonus feature inspired by audio.html)
    window.stopAllAudio = function() {
        Object.keys(audioSources).forEach(audioType => {
            const audio = audioSources[audioType];
            const playButton = document.querySelector(`button[data-audio="${audioType}"]`);
            const slider = document.querySelector(`input[data-audio="${audioType}"]`);
            
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                playButton.textContent = '▶';
                playButton.classList.remove('playing');
            }
            
            // Also reset volume sliders
            if (slider) {
                slider.value = 0;
                updateVolumeIndicator(slider);
            }
        });
        
        // Reset master controls
        const pauseAllButton = document.querySelector('.pause-all-button');
        if (pauseAllButton) {
            pauseAllButton.textContent = 'Pause Everything';
            pauseAllButton.classList.remove('paused');
        }
    };
});
