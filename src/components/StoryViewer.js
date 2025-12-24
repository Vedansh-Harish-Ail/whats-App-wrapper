const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion; // Accessible via global window.Motion if using UMD, or check imports

// If Motion is not global, we might need a workaround for No-Build.
// Often standard ESM import 'https://...' works.
// Let's assume for this specific file we might omit Motion if it's tricky, 
// OR we use the default imports from the index.html if we set it up as a global.
// Let's assume window.Motion exists from a UMD or we use CSS transitions for simplicity if Motion fails.

import App from '../App.js'; // Circular? No, App imports this.

const slides = [
    'Intro',
    'Total',
    'Authors',
    'Time',
    'Emojis',
    'Conclusion'
];

export default function StoryViewer({ data, onReset }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            // End of story
            // Maybe show a restart button or just stay
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    const SlideComponent = SlideMap[slides[currentSlideIndex]];

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center overflow-hidden">
            {/* Progress Bar Container */}
            <div className="absolute top-4 left-0 right-0 z-50 flex gap-1 px-2">
                {slides.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-white transition-all duration-300 ${idx < currentSlideIndex ? 'w-full' :
                                    idx === currentSlideIndex ? 'w-full animate-progress' : 'w-0'
                                }`}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Close Button */}
            <button
                onClick={onReset}
                className="absolute top-8 right-4 z-50 p-2 text-gray-400 hover:text-white"
            >
                <i data-lucide="x" className="w-6 h-6"></i>
            </button>

            {/* Navigation Zones */}
            <div className="absolute inset-0 flex z-40">
                <div className="w-1/3 h-full" onClick={prevSlide}></div>
                <div className="w-2/3 h-full" onClick={nextSlide}></div>
            </div>

            {/* Slide Content */}
            <div className="w-full max-w-md h-full flex flex-col relative z-0 pointer-events-none">
                <div className="flex-1 flex items-center justify-center p-6">
                    <SlideComponent data={data} />
                </div>
            </div>

            <div className="absolute bottom-8 text-xs text-gray-500 z-50">
                Tap right to continue • Tap left to go back
            </div>
        </div>
    );
}

// -- Sub Components (Slides) --

const IntroSlide = ({ data }) => (
    <div className="text-center space-y-6 animate-fade-in-up">
        <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
            <i data-lucide="message-circle" className="w-12 h-12 text-black"></i>
        </div>
        <h1 className="text-4xl font-bold">Your Chat<br />Wrapped</h1>
        <p className="text-xl text-gray-300">
            From {new Date(data.firstDate).toLocaleDateString()} <br />
            to {new Date(data.lastDate).toLocaleDateString()}
        </p>
    </div>
);

const TotalSlide = ({ data }) => (
    <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-green-400">Total Messages</h2>
        <div className="text-7xl font-bold my-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            {data.totalMessages.toLocaleString()}
        </div>
        <p className="text-gray-400">
            That's about {Math.round(data.totalMessages / Math.max(data.durationDays, 1))} messages per day!
        </p>
    </div>
);

const AuthorsSlide = ({ data }) => (
    <div className="w-full space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-teal-400">Top Chatterbox</h2>
        <div className="space-y-4">
            {data.authors.slice(0, 5).map((author, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold text-black text-xs">
                        {i + 1}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-semibold truncate">{author.name}</div>
                        <div className="text-xs text-gray-400 h-1 mt-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500"
                                style={{ width: `${(author.count / data.totalMessages) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="font-mono text-sm">{author.count}</div>
                </div>
            ))}
        </div>
    </div>
);

const TimeSlide = ({ data }) => {
    // Find peak hour
    const maxHour = data.hours.indexOf(Math.max(...data.hours));
    const formatHour = (h) => new Date(0, 0, 0, h).toLocaleTimeString([], { hour: 'Numeric', hour12: true });

    return (
        <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-purple-400">Night Owl or <br />Early Bird?</h2>

            <div className="py-8">
                <div className="text-6xl font-bold mb-2">
                    {formatHour(maxHour)}
                </div>
                <div className="text-gray-400">is your busiest time</div>
            </div>

            <div className="h-32 flex items-end justify-center gap-1 mx-4">
                {data.hours.map((count, h) => (
                    <div
                        key={h}
                        className={`w-full bg-green-500/30 rounded-t-sm hover:bg-green-400 transition-colors ${h === maxHour ? 'bg-green-500 shadow-lg shadow-green-500/50' : ''}`}
                        style={{ height: `${(count / Math.max(...data.hours)) * 100}%` }}
                        title={`${formatHour(h)}: ${count} messages`}
                    ></div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-4">
                <span>12 AM</span>
                <span>12 PM</span>
                <span>11 PM</span>
            </div>
        </div>
    );
};

const EmojisSlide = ({ data }) => (
    <div className="text-center space-y-8">
        <h2 className="text-3xl font-bold text-yellow-400">Top Emojis</h2>
        <div className="grid grid-cols-2 gap-4">
            {data.topEmojis.map((e, i) => (
                <div key={i} className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-800/40 border border-gray-700
                    ${i === 0 ? 'col-span-2 py-8 bg-yellow-400/10 border-yellow-400/50' : ''}
                `}>
                    <div className={`${i === 0 ? 'text-6xl' : 'text-4xl'} mb-2`}>{e.emoji}</div>
                    <div className="text-gray-400 text-sm">{e.count} uses</div>
                </div>
            ))}
        </div>
    </div>
);

const ConclusionSlide = ({ data }) => (
    <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            That's a Wrap!
        </h2>
        <p className="text-gray-300">
            You've shared a lot of moments. <br /> Here is to many more!
        </p>
        <button
            onClick={() => location.reload()}
            className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
        >
            Analyze Another Chat
        </button>
    </div>
);

const SlideMap = {
    'Intro': IntroSlide,
    'Total': TotalSlide,
    'Authors': AuthorsSlide,
    'Time': TimeSlide,
    'Emojis': EmojisSlide,
    'Conclusion': ConclusionSlide
};
