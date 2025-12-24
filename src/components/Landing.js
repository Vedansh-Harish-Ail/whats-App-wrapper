const { useState, useRef } = React;
const { Upload, FileText, AlertCircle, Loader2 } = lucide;

export default function Landing({ onFileUpload, loading, error }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.txt')) {
            onFileUpload(file);
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className="max-w-xl w-full text-center space-y-8">
            <div className="space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                    WhatsApp Wrapped
                </h1>
                <p className="text-gray-400 text-lg">
                    Relive your chat history. 100% private, processing happens on your device.
                </p>
            </div>

            <div
                className={`
          border-3 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer
          ${isDragging
                        ? 'border-green-500 bg-green-500/10 scale-102'
                        : 'border-gray-700 hover:border-green-500/50 hover:bg-gray-800/50'}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".txt"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center gap-4">
                    {loading ? (
                        <i data-lucide="loader-2" className="w-16 h-16 text-green-500 animate-spin"></i>
                    ) : (
                        <i data-lucide="upload" className={`w-16 h-16 ${isDragging ? 'text-green-400' : 'text-gray-500'}`}></i>
                    )}

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-200">
                            {loading ? 'Analyzing your chat...' : 'Drop your WhatsApp chat file here'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            or click to browse (.txt files only)
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <i data-lucide="alert-circle" className="w-5 h-5"></i>
                    <span>{error}</span>
                </div>
            )}

            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {[
                    { icon: 'shield', title: '100% Private', desc: 'No data leaves your device' },
                    { icon: 'zap', title: 'Instant', desc: 'No waiting time' },
                    { icon: 'heart', title: 'Beautiful', desc: 'Shareable story format' }
                ].map((feature, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                        <i data-lucide={feature.icon} className="w-6 h-6 text-green-500 mb-2"></i>
                        <h4 className="font-semibold text-gray-200">{feature.title}</h4>
                        <p className="text-xs text-gray-400">{feature.desc}</p>
                    </div>
                ))}
            </div>

            <script>
                lucide.createIcons();
            </script>
        </div>
    );
}
