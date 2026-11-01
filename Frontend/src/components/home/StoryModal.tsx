import React, { useEffect, useState, useRef } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Story } from '../../services/story.service';
import { AnimatePresence, motion } from 'framer-motion';

interface StoryModalProps {
    stories: Story[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ stories, initialIndex, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressInterval = useRef<any>(null);
    
    // Helper to get YouTube Embed URL
    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            const videoId = match[2];
            // Added autoplay=1, mute=1, loop=1, controls=0, etc.
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`;
        }
        return null;
    };

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            startProgress();
        } else {
            document.body.style.overflow = 'auto';
            clearInterval(progressInterval.current);
        }
        return () => {
            document.body.style.overflow = 'auto';
            clearInterval(progressInterval.current);
        };
    }, [isOpen, currentIndex]);

    const startProgress = () => {
        setProgress(0);
        clearInterval(progressInterval.current);
        const duration = 15000; // 15 seconds
        const interval = 100;
        const step = (interval / duration) * 100;

        progressInterval.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + step;
            });
        }, interval);
    };

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (!isOpen) return null;

    const currentStory = stories[currentIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            >
                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 z-[110] flex gap-1.5 h-1">
                    {stories.map((_, idx) => (
                        <div key={idx} className="flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-100 ease-linear"
                                style={{
                                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 z-[110] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-white font-bold drop-shadow-lg">{currentStory.title}</span>
                    </div>
                    <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
                        <FiX size={28} />
                    </button>
                </div>

                {/* Video Content */}
                <motion.div
                    key={currentStory._id}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    className="relative w-full h-full md:max-w-md md:h-[90vh] md:rounded-3xl overflow-hidden shadow-2xl"
                >
                    {getYoutubeEmbedUrl(currentStory.videoUrl) ? (
                        <iframe
                            src={getYoutubeEmbedUrl(currentStory.videoUrl) || ''}
                            className="w-full h-full object-cover"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            title={currentStory.title}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            src={currentStory.videoUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted={true}
                            playsInline
                            loop
                            onEnded={handleNext}
                        />
                    )}

                </motion.div>

                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hidden md:block"
                >
                    <FiChevronLeft size={32} />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hidden md:block"
                >
                    <FiChevronRight size={32} />
                </button>

                {/* Click helpers for mobile */}
                <div className="absolute inset-0 z-[105] flex md:hidden">
                    <div className="w-1/3 h-full" onClick={handlePrev} />
                    <div className="w-2/3 h-full" onClick={handleNext} />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
