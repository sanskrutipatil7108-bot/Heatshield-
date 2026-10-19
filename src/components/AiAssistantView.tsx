import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState, useEffect, useRef } from 'react';
import { 
  BotMessageSquare, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  Trash2, 
  Key, 
  AlertCircle,
  AlertTriangle,
  HeartPulse,
  Droplets,
  Clock,
  PhoneCall,
  Info
} from 'lucide-react';
import { ChatMessage, Junction, LocationInfo, WeatherCondition } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface AiAssistantViewProps {
  location: LocationInfo;
  junctions: Junction[];
  weather: WeatherCondition;
  selectedJunction: Junction | null;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  location,
  junctions,
  weather,
  selectedJunction,
}) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  // Nugen API Status State
  const [nugenStatus, setNugenStatus] = useState<{
    configured: boolean;
    provider: string;
    model: string;
    activeEngine: string;
  } | null>(null);

  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    sampleResponse?: string;
    error?: string;
    configured?: boolean;
    model?: string;
  } | null>(null);

  const [isTesting, setIsTesting] = useState(false);
  const [activeJunctionId, setActiveJunctionId] = useState<string>(
    selectedJunction?.id || junctions[0]?.id || 'pune-swargate'
  );

  const activeJunction = junctions.find((j) => j.id === activeJunctionId) || junctions[0];

  const getWelcomeText = (lang: string) => {
    if (lang === 'mr') {
      return `नमस्कार! मी **हीटशील्ड एआय सुरक्षा सहाय्यक** (Nugen API संचलित) आहे.\n\nमी **पुणे** मधील वाहतूक चौकांतील उष्णतेचा ताण, डांबराचे तापमान, सुरक्षित ड्युटी रोटेशन आणि उष्माघातापासून संरक्षणासाठी थेट मार्गदर्शन करतो.\n\nतुम्ही मला खालीलपैकी कोणतेही प्रश्न विचारू शकता:\n• अति-उष्णतेच्या काळात चौकात काय खबरदारी घ्यावी?\n• उष्माघात (Heatstroke) आणि उष्मा थकवा (Heat Exhaustion) यात काय फरक आहे?\n• पाणी आणि ओआरएस (ORS) पिण्याचा ब्रेक कधी घ्यावा?\n• स्वारगेट किंवा हडपसर चौकात ड्युटी रोटेशन कशी करावी?`;
    }
    if (lang === 'hi') {
      return `नमस्ते! मैं **हीटशील्ड एआई सुरक्षा सहायक** (Nugen API संचालित) हूं।\n\nमैं **पुणे** के ट्रैफिक चौराहों पर अत्यधिक गर्मी, लू, डामर के ताप और पुलिसकर्मियों के सुरक्षित ड्यूटी रोटेशन का मार्गदर्शन प्रदान करता हूं।\n\nआप मुझसे निम्न प्रश्न पूछ सकते हैं:\n• उच्च हीट रिस्क (High Risk) के दौरान क्या सावधानियां बरतें?\n• हीटस्ट्रोक (लू) और हीट एग्जॉशन के चेतावनी लक्षण व आपातकालीन उपचार क्या हैं?\n• पानी और ओआरएस पीने का ब्रेक कब लेना चाहिए?\n• स्वारगेट या हडपसर जंक्शन पर ट्रैफिक ड्यूटी रोटेशन कैसे करें?`;
    }
    return `Hello! I am the **HeatShield AI Safety Assistant** (powered by the Nugen API) for **Pune Traffic Police**.\n\nI provide occupational heat safety guidance, hydration protocols, and safe duty rotation planning for traffic police officers and municipal supervisors.\n\nYou can ask me:\n• "What precautions are recommended for a high-risk junction?"\n• "Explain the current heat-risk score in simple language."\n• "Suggest a safer duty rotation for this shift."\n• "Which junctions should receive shade and drinking water first?"\n• "What should an officer do if they feel dizzy during outdoor duty?"`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: getWelcomeText(language),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Nugen API',
      isAiPowered: false,
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [staticResourcesFallback, setStaticResourcesFallback] = useState<any | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Check Nugen status on mount
  useEffect(() => {
    fetch('/api/assistant/status')
      .then((res) => res.json())
      .then((data) => {
        setNugenStatus({
          configured: !!data.configured,
          provider: data.provider || 'Nugen API',
          model: data.model || 'nugen-flash-instruct',
          activeEngine: data.activeEngine || 'Nugen API',
        });
      })
      .catch((err) => console.warn('Nugen status check failed:', err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Update welcome message when language changes if only 1 message
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: getWelcomeText(language),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Nugen API',
          isAiPowered: false,
        },
      ]);
    }
  }, [language]);

  // Test Connection to Nugen API
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/assistant/test-connection');
      const data = await res.json();
      setTestResult({
        tested: true,
        success: data.success,
        message: data.message || data.error,
        sampleResponse: data.sampleResponse,
        error: data.error,
        configured: data.configured,
        model: data.model,
      });

      // Refresh status
      const statusRes = await fetch('/api/assistant/status');
      if (statusRes.ok) {
        const sData = await statusRes.json();
        setNugenStatus({
          configured: !!sData.configured,
          provider: sData.provider || 'Nugen API',
          model: sData.model || 'nugen-flash-instruct',
          activeEngine: sData.activeEngine || 'Nugen API',
        });
      }
    } catch (err: any) {
      setTestResult({
        tested: true,
        success: false,
        message: `Failed to contact backend: ${err.message}`,
        error: err.message,
        configured: false,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const suggestedQueries = language === 'mr'
    ? [
        'जास्त उष्णता धोका (High Risk) असलेल्या चौकात काय खबरदारी घ्यावी?',
        'उष्माघात (Heatstroke) व उष्मा थकवा (Heat Exhaustion) यात काय फरक आहे?',
        'पाणी व ओआरएस पिण्याचा ब्रेक कधी घ्यावा?',
        'स्वारगेट व हडपसर चौकात ड्युटी रोटेशन कशी करावी?',
        'ड्युटी दरम्यान भोवळ किंवा चक्कर आल्यास काय प्रथमोपचार करावेत?',
      ]
    : language === 'hi'
    ? [
        'उच्च हीट रिस्क (High Risk) जंक्शन पर क्या सावधानियां बरतें?',
        'हीटस्ट्रोक (लू) और हीट एग्जॉशन के चेतावनी लक्षण क्या हैं?',
        'पानी और ओआरएस पीने का ब्रेक कब लेना चाहिए?',
        'स्वारगेट और हडपसर जंक्शन पर सुरक्षित ड्यूटी रोटेशन कैसे करें?',
        'ड्यूटी के दौरान चक्कर या बेहोशी महसूस होने पर क्या करें?',
      ]
    : [
        'What precautions are recommended for a high-risk junction?',
        'What are the critical warning signs of heatstroke vs. heat exhaustion?',
        'When should traffic marshals take hydration and shaded rest breaks?',
        'Suggest a safer duty rotation for this shift.',
        'What should an officer do if they feel dizzy during outdoor duty?',
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    setChatError(null);
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          context: {
            location,
            weather,
            selectedJunction: activeJunction,
            junctions: junctions.map((j) => ({
              name: j.name,
              temp: j.temp,
              humidity: j.humidity,
              riskScore: j.riskScore,
              riskCategory: j.riskCategory,
              shadePercent: j.shadePercent,
              traffic: j.traffic,
              action: j.action,
            })),
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source || 'Nugen API',
          isAiPowered: data.isAiPowered ?? true,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Nugen API failure or missing credentials
        const errText = data.error || data.message || 'Nugen API communication failed.';
        setChatError(errText);
        if (data.staticResources) {
          setStaticResourcesFallback(data.staticResources);
        }

        const fallbackMsg: ChatMessage = {
          id: `asst-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Nugen API Connection Notice:**\n${errText}\n\n*Displaying verified Pune Traffic Police Standard Heat Safety SOP below.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Verified Local Safety SOP (Static Fallback)',
          isAiPowered: false,
          error: errText,
          staticResources: data.staticResources,
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err: any) {
      const msg = `Network error contacting backend: ${err.message}`;
      setChatError(msg);
      const errorMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Connection Error:** ${msg}. Please ensure backend server is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Error Handler',
        isAiPowered: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: getWelcomeText(language),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Nugen API',
        isAiPowered: false,
      },
    ]);
    setChatError(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <BotMessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.aiTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/70 text-violet-800 dark:text-violet-300 font-bold border border-violet-200 dark:border-violet-800">
              NUGEN API EXCLUSIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.aiSubtitle} Context-aware safety advisory copilot for traffic officers and supervisors.
          </p>
        </div>

        {/* Nugen API Status Indicator & Test Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                nugenStatus?.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-700 dark:text-slate-300">
              {nugenStatus?.configured ? 'Nugen Engine Ready' : 'Nugen Key Pending'}
            </span>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition disabled:opacity-50 shadow-xs"
            title="Test real-time connection to Nugen API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>

      {/* Test Connection Diagnostic Banner */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
            testResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
              Nugen API Diagnostic Result
            </span>
            <button
              onClick={() => setTestResult(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              Dismiss
            </button>
          </div>
          <p>{testResult.message}</p>
          {testResult.sampleResponse && (
            <p className="font-mono text-[11px] bg-white/60 dark:bg-black/30 p-2 rounded-lg">
              Reply: "{testResult.sampleResponse}"
            </p>
          )}
        </div>
      )}

      {/* Active Junction Context Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-bold">Active Junction Context:</span>
          <select
            value={activeJunctionId}
            onChange={(e) => setActiveJunctionId(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-hidden"
          >
            {junctions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name} ({j.temp}°C - {j.riskCategory} Risk)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span>Score: <strong>{activeJunction.riskScore}/100</strong></span>
          <span>Traffic: <strong>{activeJunction.traffic}</strong></span>
          <span>Shade: <strong>{activeJunction.shadePercent}%</strong></span>
          <span>Water: <strong>{activeJunction.drinkingWaterNearby ? 'Yes' : 'No'}</strong></span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Chat Messages Log */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-xs ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-violet-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-semibold rounded-tr-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="ai-markdown prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Static Resources Fallback Card if Present */}
                  {msg.staticResources && (
                    <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 text-slate-800 dark:text-slate-200 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                        <HeartPulse className="w-4 h-4" />
                        <span>Pune Traffic Police Standard Heat Safety Protocols:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                          <strong className="text-red-700 dark:text-red-400 block mb-1">
                            Heatstroke (Critical Emergency 112/108):
                          </strong>
                          <p>{msg.staticResources.critical_first_aid?.heatstroke?.immediate_action || msg.staticResources.heatExhaustionVsHeatstroke?.heatstroke?.treatment}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                          <strong className="text-amber-700 dark:text-amber-400 block mb-1">
                            Heat Exhaustion:
                          </strong>
                          <p>{msg.staticResources.critical_first_aid?.heat_exhaustion?.immediate_action || msg.staticResources.heatExhaustionVsHeatstroke?.heatExhaustion?.treatment}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer Timestamp & Engine Badge */}
                  <div
                    className={`flex items-center justify-between text-[10px] font-mono pt-1 ${
                      isUser ? 'text-slate-900/70' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-bold">
                        {msg.source}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-lg mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 text-white flex items-center justify-center shrink-0">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-500" />
                <span>Nugen API is generating context-aware safety guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Suggested:
          </span>
          {suggestedQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:text-amber-500 transition shrink-0 whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              language === 'mr'
                ? 'उष्णता सुरक्षा किंवा ड्युटी नियोजनाबद्दल प्रश्न विचारा...'
                : language === 'hi'
                ? 'गर्मी सुरक्षा या ड्यूटी रोटेशन के बारे में प्रश्न पूछें...'
                : 'Ask about junction heat risk, safe duty rotation, or heatstroke symptoms...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition disabled:opacity-50 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
