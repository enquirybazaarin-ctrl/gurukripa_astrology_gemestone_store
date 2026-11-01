import React, { useEffect, useRef, useState } from 'react';
import { Story } from '../../services/story.service';

interface StoryCardProps {
    story: Story;
    onOpen: () => void;
    isActiveInViewport: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onOpen, isActiveInViewport }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Helper to get YouTube Embed URL
    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            const videoId = match[2];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`;
        }
        return null;
    };

    useEffect(() => {
        if (videoRef.current) {
            if (isActiveInViewport && !isHovered) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isActiveInViewport, isHovered]);

    return (
        <div
            className="relative flex-shrink-0 w-40 h-72 md:w-56 md:h-[400px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onOpen()}
        >
            {/* Skeleton / Loader */}
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Video / YouTube Content */}
            {getYoutubeEmbedUrl(story.videoUrl) ? (
                <iframe
                    src={getYoutubeEmbedUrl(story.videoUrl) || ''}
                    className="w-full h-full object-cover pointer-events-none"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    onLoad={() => setIsLoading(false)}
                    title={story.title}
                />
            ) : (
                <video
                    ref={videoRef}
                    src={story.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onCanPlay={() => setIsLoading(false)}
                    onLoadedData={() => setIsLoading(false)}
                    onError={(e) => {
                        console.error("Video loading error:", e);
                        setIsLoading(false);
                    }}
                />
            )}


            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />


            {/* Title */}
            <div className="absolute bottom-4 left-3 right-3 pointer-events-none">
                <h3 className="text-white text-sm md:text-base font-semibold line-clamp-2 drop-shadow-md">
                    {story.title}
                </h3>
            </div>

            {/* Progress Bar (Static mock for card) */}
            <div className="absolute top-0 left-0 right-0 h-1 flex px-1 pt-1 gap-1">
                <div className="h-full bg-white/40 flex-1 rounded-full overflow-hidden">
                    {isActiveInViewport && !isHovered && (
                        <div className="h-full bg-white animate-progress" />
                    )}
                </div>
            </div>
        </div>
    );
};
