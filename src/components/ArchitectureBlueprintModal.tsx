import React, { useState } from 'react';
import {
  X,
  Layers,
  Database,
  Server,
  Zap,
  HardDrive,
  Cpu,
  Shield,
  Activity,
  Terminal,
  Copy,
  Check,
  Code2,
  RefreshCw,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const ArchitectureBlueprintModal: React.FC = () => {
  const { isBlueprintOpen, setIsBlueprintOpen, matrixLogs, logMatrixEvent } = useChat();
  const [selectedNode, setSelectedNode] = useState<string>('synapse');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isBlueprintOpen) return null;

  const nodeDetails: Record<
    string,
    {
      title: string;
      tag: string;
      description: string;
      tech: string;
      port: string;
      status: string;
      configSnippet: string;
    }
  > = {
    client: {
      title: 'Frontend Clients (React / Flutter)',
      tag: 'CLIENT LAYER',
      description:
        'Cross-platform clients interfacing with Synapse homeserver via Matrix Client-Server API v3 and Vodozemac Megolm cryptographic ratchets.',
      tech: 'React 18 + Vite / Flutter Matrix Dart SDK',
      port: '3000 (HTTPS/WSS)',
      status: 'Healthy • Connected',
      configSnippet: `// Matrix SDK Client Initialization
const client = matrixcs.createClient({
  baseUrl: "https://matrix.wat.chat",
  userId: "@amara:wat.chat",
  accessToken: "syt_YW1hcmE_...",
  crypto: {
    cryptoCallbacks: new MemoryCryptoStore(),
    algorithm: "m.megolm.v1.aes-sha2"
  }
});
await client.initCrypto();
await client.startClient({ initialSyncLimit: 20 });`,
    },
    synapse: {
      title: 'Synapse Matrix Homeserver',
      tag: 'CORE MESSAGING ENGINE',
      description:
        'Reference Matrix homeserver handling federated room state, user presence, access token validation, and room event directed acyclic graphs (DAG).',
      tech: 'Matrix Synapse v1.98 (Rust Crypto Engine)',
      port: '8008 / 8448 (Federation)',
      status: 'Running • 24 Worker Pools',
      configSnippet: `# homeserver.yaml configuration
server_name: "wat.chat"
enable_registration: false
enable_presence: true
url_preview_enabled: true
app_service_config_files: []

database:
  name: psycopg2
  args:
    user: synapse_user
    password: "\${SYNAPSE_DB_PASSWORD}"
    database: synapse
    host: postgres.internal
    cp_min: 5
    cp_max: 20

redis:
  enabled: true
  host: redis.internal
  port: 6379`,
    },
    postgres: {
      title: 'PostgreSQL Relational Storage',
      tag: 'STATE PERSISTENCE',
      description:
        'Stores room state DAGs, membership hierarchies, E2EE device key bundles, access tokens, and read receipt markers.',
      tech: 'PostgreSQL 16 (B-Tree + GIN indexing)',
      port: '5432',
      status: 'Active • 4.2ms avg query',
      configSnippet: `-- Synapse core schema sample
SELECT event_id, room_id, type, sender, origin_server_ts, content
FROM events 
WHERE room_id = '!nZ4bQ:wat.chat' 
ORDER BY origin_server_ts DESC LIMIT 50;`,
    },
    redis: {
      title: 'Redis Ephemeral Cache & Pub/Sub',
      tag: 'HIGH-THROUGHPUT PUB/SUB',
      description:
        'Coordinates real-time sync workers, typing notifications, presence broadcasts, and rate limiting across Synapse worker clusters.',
      tech: 'Redis 7.2 (In-Memory + Pub/Sub)',
      port: '6379',
      status: 'Cluster Online • 18k ops/sec',
      configSnippet: `# Redis Pub/Sub channels
SUBSCRIBE "matrix:presence"
SUBSCRIBE "matrix:typing:room_!nZ4bQ"
PUBLISH "matrix:sync:device_amara_web" '{"event":"m.room.message"}'`,
    },
    minio: {
      title: 'MinIO / S3 Object Storage',
      tag: 'MEDIA REPOSITORY',
      description:
        'S3-compatible distributed object storage for encrypted voice notes, high-res photos, videos, and document media artifacts.',
      tech: 'MinIO Distributed Object Store',
      port: '9000 / 9001 (Console)',
      status: 'Encrypted at Rest (AES-256-GCM)',
      configSnippet: `# Media repository s3 storage backend
media_storage_providers:
  - module: synapse_s3_storage_provider.S3StorageProviderExtension
    config:
      bucket: "wat-synapse-media"
      endpoint_url: "https://s3.wat.chat"
      region_name: "af-south-1"`,
    },
    ai_api: {
      title: 'WAT Custom API & AI Engine',
      tag: 'BUSINESS & INTELLIGENCE LAYER',
      description:
        'Dedicated backend handling Mobile Money settlements (M-Pesa, MTN MoMo), Merchant catalog management, and Gemini AI smart features (Translation, Transcription, Conversation summaries).',
      tech: 'Node.js Express + @google/genai (Gemini 3.7 Flash)',
      port: '3000 (/api/*)',
      status: 'Optimal • 0.3s AI Latency',
      configSnippet: `// Server-Side Gemini API Proxy in server.ts
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});`,
    },
  };

  const currentDetail = nodeDetails[selectedNode] || nodeDetails.synapse;

  const copySnippet = () => {
    navigator.clipboard.writeText(currentDetail.configSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateSync = () => {
    logMatrixEvent(
      'm.room.encrypted',
      `/_matrix/client/v3/sync?filter=10294`,
      `Sync roundtrip: 0 new events, 12 presence updates`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <span>WAT Matrix Architecture Blueprint</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/40">
                  LIVE INSPECTOR
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Interactive architecture map, Synapse topology, and live Matrix CS-API event streaming
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBlueprintOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left visual topology diagram, Right spec inspector */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
          {/* Left Column: Interactive Topology Node Graph */}
          <div className="lg:col-span-7 p-6 overflow-y-auto bg-neutral-950/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                System Topology & Component Graph
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Click any node to inspect specs
              </span>
            </div>

            {/* Layer 1: Clients */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('client')}
                className={`w-full max-w-md p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedNode === 'client'
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-400'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    APP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-100">
                      Mobile & Web Client Applications
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Flutter (Dart) • React 18 (TypeScript) • Vodozemac Olm
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">WSS/HTTPS</span>
              </button>

              {/* Vertical connector */}
              <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-400 to-cyan-400" />
            </div>

            {/* Layer 2: Synapse Homeserver */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('synapse')}
                className={`w-full max-w-md p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedNode === 'synapse'
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-xl shadow-cyan-900/30 ring-1 ring-cyan-400'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                      <span>SYNAPSE MATRIX HOMESERVER</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Matrix Core Engine • Event DAGs • Federation • Worker Clusters
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">:8008</span>
              </button>

              {/* Vertical connector split */}
              <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-indigo-400" />
            </div>

            {/* Layer 3: Tri-Core Storage & Cache */}
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              {/* Postgres */}
              <button
                onClick={() => setSelectedNode('postgres')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-center text-center ${
                  selectedNode === 'postgres'
                    ? 'bg-indigo-500/20 border-indigo-400 ring-1 ring-indigo-400'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Database className="w-5 h-5 text-indigo-400 mb-1" />
                <span className="text-[11px] font-bold text-neutral-200">PostgreSQL</span>
                <span className="text-[9px] text-neutral-500 font-mono">Room State DB</span>
              </button>

              {/* Redis */}
              <button
                onClick={() => setSelectedNode('redis')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-center text-center ${
                  selectedNode === 'redis'
                    ? 'bg-rose-500/20 border-rose-400 ring-1 ring-rose-400'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Zap className="w-5 h-5 text-rose-400 mb-1" />
                <span className="text-[11px] font-bold text-neutral-200">Redis Cache</span>
                <span className="text-[9px] text-neutral-500 font-mono">Pub/Sub Pool</span>
              </button>

              {/* MinIO */}
              <button
                onClick={() => setSelectedNode('minio')}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-center text-center ${
                  selectedNode === 'minio'
                    ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <HardDrive className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-[11px] font-bold text-neutral-200">MinIO / S3</span>
                <span className="text-[9px] text-neutral-500 font-mono">Media Vault</span>
              </button>
            </div>

            {/* Layer 4: Custom API & AI Layer */}
            <div className="flex flex-col items-center pt-2">
              <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-400 to-emerald-400" />
              <button
                onClick={() => setSelectedNode('ai_api')}
                className={`w-full max-w-md p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedNode === 'ai_api'
                    ? 'bg-emerald-500/20 border-emerald-400 shadow-lg ring-1 ring-emerald-400'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-100">
                      WAT Custom API & AI Layer
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Mobile Money (M-Pesa/MoMo) • Catalog • Gemini 3.7 Flash AI
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">:3000</span>
              </button>
            </div>
          </div>

          {/* Right Column: Node Details & Live Matrix CS-API Event Stream */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between overflow-y-auto bg-neutral-950/70">
            <div>
              {/* Selected Node Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {currentDetail.tag}
                  </span>
                  <h3 className="text-base font-bold text-neutral-100">
                    {currentDetail.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-[11px] font-mono text-neutral-300">
                  {currentDetail.port}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
                {currentDetail.description}
              </p>

              {/* Configuration / Code Snippet */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Configuration / Runtime Spec</span>
                  </span>
                  <button
                    onClick={copySnippet}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-44">
                  <pre>{currentDetail.configSnippet}</pre>
                </div>
              </div>

              {/* Live Matrix Event Stream Log */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Matrix CS-API Live Event Stream</span>
                  </span>
                  <button
                    onClick={handleSimulateSync}
                    className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Trigger Sync</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                  {matrixLogs.slice(0, 6).map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-[10px] font-mono"
                    >
                      <div className="flex items-center justify-between text-neutral-400 mb-0.5">
                        <span className="text-emerald-400 font-bold">{log.type}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-neutral-300 truncate">{log.endpoint}</div>
                      <div className="text-neutral-500 italic mt-0.5 truncate">
                        {log.payloadSummary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-500">
                Matrix Specification: v1.10 (Megolm E2EE)
              </span>
              <button
                onClick={() => setIsBlueprintOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
