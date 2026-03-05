import React, { useState } from 'react';
import { 
  Layout, 
  Sparkles, 
  Image as ImageIcon, 
  Code2, 
  Database, 
  MessageSquare,
  ChevronRight,
  Terminal,
  Cpu,
  Zap,
  Languages,
  Mic,
  Globe,
  Type as TypeIcon,
  Volume2,
  Mic2,
  Fingerprint,
  BrainCircuit,
  Tags,
  Subtitles,
  Sun,
  Moon,
  Download
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { generateText, analyzeImage, extractData, generateSpeech, processAudio } from './services/geminiService';
import { Type } from '@google/genai';
import { useEffect } from 'react';

// --- Types ---
type FeatureId = 'content' | 'vision' | 'code' | 'data' | 'chat' | 'lang-id' | 'transcription' | 'translation' | 'transliteration' | 'tts' | 'voice-over' | 'voice-print' | 'training' | 'annotation' | 'subtitling';

interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const FEATURES: Feature[] = [
  { 
    id: 'content', 
    name: 'Content Forge', 
    description: 'Generate high-quality marketing copy and creative content.', 
    icon: Sparkles,
    color: 'text-amber-500'
  },
  { 
    id: 'vision', 
    name: 'Vision Lab', 
    description: 'Analyze images, detect objects, and extract visual context.', 
    icon: ImageIcon,
    color: 'text-blue-500'
  },
  { 
    id: 'code', 
    name: 'Code Architect', 
    description: 'Expert coding assistance, debugging, and refactoring.', 
    icon: Code2,
    color: 'text-emerald-500'
  },
  { 
    id: 'data', 
    name: 'Data Extractor', 
    description: 'Transform unstructured text into clean, structured JSON.', 
    icon: Database,
    color: 'text-purple-500'
  },
  { 
    id: 'chat', 
    name: 'Multimodal Chat', 
    description: 'Versatile AI assistant for complex reasoning and tasks.', 
    icon: MessageSquare,
    color: 'text-rose-500'
  },
  { 
    id: 'lang-id', 
    name: 'Language ID', 
    description: 'Automatically identify the language of any text or audio file.', 
    icon: Languages,
    color: 'text-indigo-500'
  },
  { 
    id: 'transcription', 
    name: 'Transcription', 
    description: 'Convert speech from audio files into accurate text.', 
    icon: Mic,
    color: 'text-cyan-500'
  },
  { 
    id: 'translation', 
    name: 'Translation', 
    description: 'Translate text between dozens of world languages.', 
    icon: Globe,
    color: 'text-blue-600'
  },
  { 
    id: 'transliteration', 
    name: 'Transliteration', 
    description: 'Convert text between different scripts and alphabets.', 
    icon: TypeIcon,
    color: 'text-orange-500'
  },
  { 
    id: 'tts', 
    name: 'Text to Speech', 
    description: 'Generate natural-sounding speech from text.', 
    icon: Volume2,
    color: 'text-pink-500'
  },
  { 
    id: 'voice-over', 
    name: 'Voice Over', 
    description: 'Professional AI-generated voiceovers for media.', 
    icon: Mic2,
    color: 'text-red-500'
  },
  { 
    id: 'voice-print', 
    name: 'Voice Print Analysis', 
    description: 'Analyze vocal characteristics and speaker traits.', 
    icon: Fingerprint,
    color: 'text-slate-500'
  },
  { 
    id: 'training', 
    name: 'Training Models', 
    description: 'Custom AI model fine-tuning and optimization.', 
    icon: BrainCircuit,
    color: 'text-violet-500'
  },
  { 
    id: 'annotation', 
    name: 'Data Annotation', 
    description: 'Label datasets for machine learning training.', 
    icon: Tags,
    color: 'text-lime-500'
  },
  { 
    id: 'subtitling', 
    name: 'Subtitling', 
    description: 'Generate timed subtitles for video and audio content.', 
    icon: Subtitles,
    color: 'text-sky-500'
  },
];

// --- Components ---

const SidebarItem = ({ 
  feature, 
  isActive, 
  onClick 
}: { 
  feature: Feature; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left group relative overflow-hidden text-white",
      isActive 
        ? "bg-brand-600/20 shadow-md" 
        : "hover:bg-white/5"
    )}
  >
    <div className={cn(
      "p-2 rounded-lg transition-all duration-300",
      isActive 
        ? "bg-brand-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]" 
        : "bg-white/10 text-white group-hover:bg-white/20 group-hover:scale-110"
    )}>
      <feature.icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className={cn(
        "!font-bold text-[14px] leading-tight truncate transition-colors !text-white",
        !isActive && "opacity-70 group-hover:opacity-100"
      )}>
        {feature.name}
      </h3>
    </div>
    {isActive && (
      <motion.div 
        layoutId="active-pill" 
        className="absolute left-0 w-1 h-5 bg-brand-400 rounded-full"
      />
    )}
  </button>
);

// --- Feature Panels ---

const ContentForge = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const text = await generateText(prompt, "You are an expert copywriter for Transflow360.AI. Create compelling, professional content.");
      setResult(text || '');
    } catch (err) {
      console.error(err);
      setResult("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">What should I write for you?</label>
        <textarea 
          className="input-field min-h-[120px] resize-none"
          placeholder="e.g., Write a 3-sentence elevator pitch for a new AI-powered logistics platform..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button 
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
        Generate Content
      </button>
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 prose max-w-none"
        >
          <Markdown>{result}</Markdown>
        </motion.div>
      )}
    </div>
  );
};

const VisionLab = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const text = await analyzeImage(prompt, image, "image/jpeg");
      setResult(text || '');
    } catch (err) {
      console.error(err);
      setResult("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Upload" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-medium">Change Image</label>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <ImageIcon size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 10MB</p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Analysis Prompt</label>
            <input 
              className="input-field"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading || !image}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
            Analyze Image
          </button>
        </div>
      </div>
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 prose max-w-none"
        >
          <Markdown>{result}</Markdown>
        </motion.div>
      )}
    </div>
  );
};

const DataExtractor = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const schema = {
        type: Type.OBJECT,
        properties: {
          entities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, description: "Person, Organization, Location, or Date" },
                sentiment: { type: Type.STRING, description: "Positive, Negative, or Neutral" }
              }
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["entities", "summary"]
      };
      const data = await extractData(text, schema);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Unstructured Text</label>
        <textarea 
          className="input-field min-h-[120px]"
          placeholder="Paste an article, email, or report here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button 
        onClick={handleExtract}
        disabled={loading || !text}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Database size={18} />}
        Extract Insights
      </button>
      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-emerald-600 font-mono text-sm overflow-auto max-h-[400px]"
        >
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </motion.div>
      )}
    </div>
  );
};

const CodeArchitect = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const text = await generateText(prompt, "You are a world-class senior software engineer. Provide clean, efficient, and well-documented code solutions.");
      setResult(text || '');
    } catch (err) {
      console.error(err);
      setResult("Error generating code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Coding Task</label>
        <textarea 
          className="input-field min-h-[120px] font-mono"
          placeholder="e.g., Create a React hook for handling local storage with type safety..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button 
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Terminal size={18} />}
        Architect Solution
      </button>
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 prose max-w-none"
        >
          <Markdown>{result}</Markdown>
        </motion.div>
      )}
    </div>
  );
};

const MultimodalChat = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    
    try {
      const response = await generateText(userMsg, "You are a helpful AI assistant integrated into Transflow360.AI platform.");
      setMessages(prev => [...prev, { role: 'ai', content: response || '' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <MessageSquare size={48} strokeWidth={1} />
            <p>Start a conversation with Transflow360 AI</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex",
            msg.role === 'user' ? "justify-end" : "justify-start"
          )}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl",
              msg.role === 'user' 
                ? "bg-brand-600 text-white rounded-tr-none" 
                : "bg-slate-50 text-slate-700 border border-slate-200 rounded-tl-none prose prose-sm"
            )}>
              {msg.role === 'ai' ? <Markdown>{msg.content}</Markdown> : msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input 
            className="input-field"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input}
            className="btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const LanguageID = () => {
  const [text, setText] = useState('');
  const [audio, setAudio] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('audio/mpeg');
  const [mode, setMode] = useState<'text' | 'audio'>('text');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || 'audio/mpeg');
      const reader = new FileReader();
      reader.onloadend = () => setAudio(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    setLoading(true);
    setResult('');
    try {
      if (mode === 'text') {
        if (!text) return;
        const res = await generateText(`Identify the language of this text and provide the ISO code and full name: "${text}"`, "You are a linguistics expert.");
        setResult(res || '');
      } else {
        if (!audio) return;
        const res = await processAudio("Identify the language spoken in this audio file. Provide the ISO code and full name of the language.", audio, mimeType);
        setResult(res || '');
      }
    } catch (err) {
      console.error(err);
      setResult("Error identifying language.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => setMode('text')} 
          className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'text' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          Text Mode
        </button>
        <button 
          onClick={() => setMode('audio')} 
          className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'audio' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          Audio Mode
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'text' ? (
          <motion.div 
            key="text-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Text to Identify</label>
              <textarea 
                className="input-field min-h-[120px]" 
                placeholder="Paste text in any language..." 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="audio-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Audio File</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-brand-500 transition-colors bg-slate-50/50">
                <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" id="audio-lid-upload" />
                <label htmlFor="audio-lid-upload" className="cursor-pointer space-y-3 block">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-brand-600">
                    <Mic size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Click to upload audio</p>
                    <p className="text-xs text-slate-500 mt-1">MP3, WAV, M4A supported</p>
                  </div>
                </label>
              </div>
              {audio && (
                <div className="p-3 bg-brand-50 rounded-lg flex items-center gap-3 border border-brand-100">
                  <Volume2 size={16} className="text-brand-600" />
                  <span className="text-xs font-bold text-brand-700">Audio file loaded successfully</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={handleIdentify} 
        disabled={loading || (mode === 'text' ? !text : !audio)} 
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Languages size={18} />}
        Identify Language
      </button>

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl bg-slate-900 text-white font-bold shadow-xl border border-white/10"
        >
          <div className="flex items-center gap-2 mb-2 text-brand-400">
            <Globe size={16} />
            <span className="text-[10px] uppercase tracking-widest font-black">Result</span>
          </div>
          <p className="text-lg">{result}</p>
        </motion.div>
      )}
    </div>
  );
};

const Transcription = () => {
  const [audio, setAudio] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese', 'Japanese', 'Korean', 'Russian', 'Arabic', 'Portuguese', 'Italian', 'Turkish', 'Dutch', 'Bengali', 'Urdu', 'Tamil', 'Telugu', 'Gujarati', 'Polish', 'Ukrainian', 'Vietnamese', 'Thai', 'Indonesian', 'Malay', 'Swahili', 'Persian', 'Greek', 'Hebrew', 'Czech', 'Romanian', 'Hungarian', 'Finnish', 'Norwegian', 'Swedish', 'Danish', 'Slovak', 'Bulgarian', 'Serbian', 'Croatian', 'Catalan', 'Filipino', 'Afrikaans', 'Estonian', 'Latvian', 'Lithuanian', 'Slovenian', 'Icelandic', 'Maltese', 'Irish', 'Welsh', 'Albanian', 'Armenian', 'Azerbaijani', 'Basque', 'Georgian', 'Macedonian', 'Mongolian', 'Nepali', 'Pashto', 'Sinhala', 'Tajik', 'Turkmen', 'Uzbek'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAudio(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTranscribe = async () => {
    if (!audio) return;
    setLoading(true);
    try {
      const text = await processAudio(`Transcribe this audio accurately in ${language}. Provide only the transcript.`, audio, "audio/mpeg");
      setResult(text || '');
    } catch (err) {
      console.error(err);
      setResult("Error transcribing audio.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
          {audio ? (
            <div className="p-6 text-center">
              <Mic size={40} className="mx-auto text-brand-600 mb-2" />
              <p className="text-sm font-medium text-slate-900">Audio File Loaded</p>
              <button onClick={() => setAudio(null)} className="text-xs text-red-500 mt-2 hover:underline">Remove</button>
            </div>
          ) : (
            <div className="text-center p-6">
              <Mic size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Upload audio file (MP3, WAV)</p>
            </div>
          )}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="audio/*" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Audio Language</label>
            <select
              className="input-field"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <button onClick={handleTranscribe} disabled={loading || !audio} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mic size={18} />}
            Transcribe Audio
          </button>
        </div>
      </div>
      {result && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Transcription Result</h3>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest"
            >
              <Download size={14} />
              Download .txt
            </button>
          </div>
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 prose max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

const Translation = () => {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('Spanish');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await generateText(`Translate this text to ${target}: "${text}"`, "You are a professional translator.");
      setResult(res || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Source Text</label>
          <textarea className="input-field min-h-[120px]" placeholder="Enter text to translate..." value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Target Language</label>
          <input className="input-field" placeholder="e.g., French, Japanese, Hindi..." value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
      </div>
      <button onClick={handleTranslate} disabled={loading || !text} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Globe size={18} />}
        Translate
      </button>
      {result && <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">{result}</div>}
    </div>
  );
};

const Transliteration = () => {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('Latin script');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransliterate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await generateText(`Transliterate this text to ${target}: "${text}"`, "You are an expert in scripts and phonetics.");
      setResult(res || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Source Text</label>
          <textarea className="input-field min-h-[120px]" placeholder="Enter text (e.g., in Devanagari, Cyrillic)..." value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Target Script</label>
          <input className="input-field" placeholder="e.g., Latin, Arabic, Greek..." value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
      </div>
      <button onClick={handleTransliterate} disabled={loading || !text} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <TypeIcon size={18} />}
        Transliterate
      </button>
      {result && <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono">{result}</div>}
    </div>
  );
};

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const base64 = await generateSpeech(text, voice);
      if (base64) {
        setAudioUrl(`data:audio/wav;base64,${base64}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Text to Speak</label>
        <textarea className="input-field min-h-[120px]" placeholder="Type something to convert to speech..." value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="flex gap-4">
        {['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'].map(v => (
          <button key={v} onClick={() => setVoice(v)} className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", voice === v ? "bg-brand-600 border-brand-600 text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-brand-500")}>
            {v}
          </button>
        ))}
      </div>
      <button onClick={handleGenerate} disabled={loading || !text} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Volume2 size={18} />}
        Generate Speech
      </button>
      {audioUrl && (
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};

const VoiceOver = () => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('Professional and calm');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const prompt = `Speak the following text in a ${style} style: ${text}`;
      const base64 = await generateSpeech(prompt, 'Zephyr');
      if (base64) setAudioUrl(`data:audio/wav;base64,${base64}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Script</label>
          <textarea className="input-field min-h-[120px]" placeholder="Enter script for voiceover..." value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Style / Tone</label>
          <input className="input-field" placeholder="e.g., Excited and energetic, Somber and deep..." value={style} onChange={(e) => setStyle(e.target.value)} />
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading || !text} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mic2 size={18} />}
        Generate Voice Over
      </button>
      {audioUrl && <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center"><audio controls src={audioUrl} className="w-full" /></div>}
    </div>
  );
};

const VoicePrintAnalysis = () => {
  const [audio, setAudio] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAudio(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!audio) return;
    setLoading(true);
    try {
      const res = await processAudio("Analyze this voice print. Describe vocal characteristics, estimated age, gender, emotional state, and any unique traits.", audio, "audio/mpeg");
      setResult(res || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
        {audio ? (
          <div className="p-6 text-center">
            <Fingerprint size={40} className="mx-auto text-brand-600 mb-2" />
            <p className="text-sm font-medium text-slate-900">Voice Sample Loaded</p>
          </div>
        ) : (
          <div className="text-center p-6">
            <Fingerprint size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">Upload voice sample for analysis</p>
          </div>
        )}
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="audio/*" />
      </div>
      <button onClick={handleAnalyze} disabled={loading || !audio} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Fingerprint size={18} />}
        Analyze Voice Print
      </button>
      {result && <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 prose max-w-none"><Markdown>{result}</Markdown></div>}
    </div>
  );
};

const TrainingModels = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Fine-tuning", icon: BrainCircuit, desc: "Adapt models to your specific domain data." },
          { title: "RLHF", icon: Zap, desc: "Optimize model behavior with human feedback." },
          { title: "Quantization", icon: Cpu, desc: "Reduce model size for edge deployment." }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all">
            <item.icon className="text-brand-600 mb-4" size={32} />
            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
        <h3 className="text-xl font-bold mb-4">Custom Model Pipeline</h3>
        <div className="space-y-4">
          {[
            "1. Data Ingestion & Cleaning",
            "2. Base Model Selection (Gemini 1.5/2.0)",
            "3. Supervised Fine-Tuning (SFT)",
            "4. Evaluation & Safety Guardrails",
            "5. Deployment to Production API"
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white">{i+1}</div>
              <span className="text-sm text-slate-600">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DataAnnotation = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnnotate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const schema = {
        type: Type.OBJECT,
        properties: {
          annotations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                label: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              }
            }
          }
        }
      };
      const res = await extractData(`Annotate this text for named entities and concepts: "${text}"`, schema);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Raw Data for Annotation</label>
        <textarea className="input-field min-h-[120px]" placeholder="Paste text to be labeled..." value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button onClick={handleAnnotate} disabled={loading || !text} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Tags size={18} />}
        Auto-Annotate
      </button>
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.annotations?.map((ann: any, i: number) => (
            <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase mr-2">{ann.label}</span>
                <span className="text-sm text-slate-900">{ann.text}</span>
              </div>
              <span className="text-[10px] text-slate-500">{(ann.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Subtitling = () => {
  const [audio, setAudio] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAudio(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!audio) return;
    setLoading(true);
    try {
      const res = await processAudio("Generate SRT format subtitles for this audio. Include timestamps.", audio, "audio/mpeg");
      setResult(res || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
        {audio ? (
          <div className="p-6 text-center">
            <Subtitles size={40} className="mx-auto text-brand-600 mb-2" />
            <p className="text-sm font-medium text-slate-900">Media Loaded</p>
          </div>
        ) : (
          <div className="text-center p-6">
            <Subtitles size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">Upload video or audio for subtitling</p>
          </div>
        )}
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="video/*,audio/*" />
      </div>
      <button onClick={handleGenerate} disabled={loading || !audio} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Subtitles size={18} />}
        Generate Subtitles
      </button>
      {result && <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-emerald-700 font-mono text-xs overflow-auto max-h-[400px] whitespace-pre-wrap">{result}</div>}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>('content');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderFeature = () => {
    switch (activeFeature) {
      case 'content': return <ContentForge />;
      case 'vision': return <VisionLab />;
      case 'code': return <CodeArchitect />;
      case 'data': return <DataExtractor />;
      case 'chat': return <MultimodalChat />;
      case 'lang-id': return <LanguageID />;
      case 'transcription': return <Transcription />;
      case 'translation': return <Translation />;
      case 'transliteration': return <Transliteration />;
      case 'tts': return <TextToSpeech />;
      case 'voice-over': return <VoiceOver />;
      case 'voice-print': return <VoicePrintAnalysis />;
      case 'training': return <TrainingModels />;
      case 'annotation': return <DataAnnotation />;
      case 'subtitling': return <Subtitling />;
      default: return null;
    }
  };

  const currentFeature = FEATURES.find(f => f.id === activeFeature)!;

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-72 sidebar-glass flex flex-col sticky top-0 h-screen z-20 !opacity-100">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Cpu size={22} />
            </div>
            <div>
              <h1 className="text-xl !font-bold tracking-tight !text-white leading-none">
                Transflow<span className="text-brand-400">360</span>
              </h1>
              <p className="text-[10px] !text-white/60 !font-bold uppercase tracking-[0.2em] mt-1.5">Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-0.5 scrollbar-hide">
          <div className="px-4 mb-4">
            <span className="text-[11px] !font-black !text-white/40 uppercase tracking-[0.2em]">Solutions</span>
          </div>
          {FEATURES.map((feature) => (
            <SidebarItem 
              key={feature.id} 
              feature={feature} 
              isActive={activeFeature === feature.id}
              onClick={() => setActiveFeature(feature.id)}
            />
          ))}
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg">
                <Sparkles size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] !font-black !text-white truncate uppercase tracking-wider">Pro Access</p>
                <p className="text-[10px] !text-white/60 !font-medium truncate">Unlimited AI Tokens</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-10 px-10 flex items-center justify-between transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl bg-slate-100 shadow-sm border border-slate-200", currentFeature.color)}>
              <currentFeature.icon size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentFeature.name}</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Operational</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-all shadow-sm"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-4">
              <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Docs</button>
              <button className="px-5 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)]">Upgrade</button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 max-w-6xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">{currentFeature.name}</h1>
            <p className="text-slate-600 text-lg max-w-3xl font-light leading-relaxed">{currentFeature.description}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="glass-panel rounded-[2rem] p-10 relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                {renderFeature()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="p-10 border-t border-white/5 text-center">
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Transflow360.AI &bull; Next-Gen Intelligence
          </p>
        </footer>
      </main>
    </div>
  );
}
