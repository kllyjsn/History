import { type FC, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { conflicts } from '../../data/conflicts';
import { countries } from '../../data/countries';
import { getConflictTypeColor, getConflictTypeBadge } from '../../utils/colorScales';
import { formatDateRange } from '../../utils/formatters';

interface ConflictGraphProps {
  onClose: () => void;
  onSelectCountry: (id: string) => void;
}

interface GraphNode {
  id: string;
  name: string;
  type: string;
  startYear: number;
  endYear: number | null;
  x: number;
  y: number;
  connections: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

const ConflictGraph: FC<ConflictGraphProps> = ({ onClose, onSelectCountry }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    const withRelations = conflicts.filter(c => c.relatedConflicts && c.relatedConflicts.length > 0);
    const relatedIds = new Set<string>();
    for (const c of withRelations) {
      relatedIds.add(c.id);
      for (const rid of c.relatedConflicts ?? []) relatedIds.add(rid);
    }

    const graphConflicts = conflicts.filter(c => relatedIds.has(c.id));
    const edgeList: GraphEdge[] = [];
    const connectionCounts: Record<string, number> = {};

    for (const c of withRelations) {
      for (const rid of c.relatedConflicts ?? []) {
        if (conflicts.some(x => x.id === rid)) {
          edgeList.push({ source: c.id, target: rid });
          connectionCounts[c.id] = (connectionCounts[c.id] ?? 0) + 1;
          connectionCounts[rid] = (connectionCounts[rid] ?? 0) + 1;
        }
      }
    }

    const width = 900;
    const height = 600;
    const nodeList: GraphNode[] = graphConflicts.map((c, i) => {
      const angle = (i / graphConflicts.length) * 2 * Math.PI;
      const radiusBase = Math.min(width, height) * 0.35;
      const connections = connectionCounts[c.id] ?? 0;
      const radius = radiusBase - connections * 8;
      return {
        id: c.id,
        name: c.name,
        type: c.type,
        startYear: c.startYear,
        endYear: c.endYear,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        connections,
      };
    });

    return { nodes: nodeList, edges: edgeList };
  }, []);

  const selectedConflict = selectedNode ? conflicts.find(c => c.id === selectedNode) : null;
  const highlightedIds = useMemo(() => {
    if (!hoveredNode && !selectedNode) return null;
    const active = hoveredNode ?? selectedNode;
    const ids = new Set<string>([active!]);
    for (const e of edges) {
      if (e.source === active) ids.add(e.target);
      if (e.target === active) ids.add(e.source);
    }
    return ids;
  }, [hoveredNode, selectedNode, edges]);

  const nodeMap = useMemo(() => {
    const map: Record<string, GraphNode> = {};
    for (const n of nodes) map[n.id] = n;
    return map;
  }, [nodes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 overflow-y-auto bg-slate-900/98 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-white">Conflict Connections</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {nodes.length} connected conflicts · {edges.length} relationships
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
          >
            Back to Map
          </button>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/20 overflow-hidden">
          <svg viewBox="0 0 900 600" className="w-full h-auto" style={{ minHeight: '400px' }}>
            {edges.map((edge, i) => {
              const source = nodeMap[edge.source];
              const target = nodeMap[edge.target];
              if (!source || !target) return null;
              const dimmed = highlightedIds && !highlightedIds.has(edge.source) && !highlightedIds.has(edge.target);
              return (
                <line
                  key={i}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={dimmed ? '#1e293b' : '#475569'}
                  strokeWidth={dimmed ? 0.5 : 1}
                  strokeOpacity={dimmed ? 0.3 : 0.5}
                />
              );
            })}

            {nodes.map((node) => {
              const color = getConflictTypeColor(node.type);
              const dimmed = highlightedIds && !highlightedIds.has(node.id);
              const r = 4 + node.connections * 1.5;
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r}
                    fill={dimmed ? '#1e293b' : color}
                    stroke={selectedNode === node.id ? '#f59e0b' : dimmed ? '#334155' : '#0f172a'}
                    strokeWidth={selectedNode === node.id ? 2 : 1}
                    opacity={dimmed ? 0.3 : 1}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  />
                  {!dimmed && r > 5 && (
                    <text
                      x={node.x}
                      y={node.y - r - 4}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="8"
                      className="pointer-events-none select-none"
                    >
                      {node.name.length > 25 ? node.name.slice(0, 22) + '...' : node.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {selectedConflict && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-800/50 p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-sm font-semibold text-white">{selectedConflict.name}</h3>
                <p className="text-xs text-slate-400">{formatDateRange(selectedConflict.startYear, selectedConflict.endYear)}</p>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: `${getConflictTypeColor(selectedConflict.type)}20`, color: getConflictTypeColor(selectedConflict.type) }}
              >
                {getConflictTypeBadge(selectedConflict.type)}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">{selectedConflict.summary}</p>
            {selectedConflict.relatedConflicts && selectedConflict.relatedConflicts.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Related Conflicts</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedConflict.relatedConflicts.map(rid => {
                    const related = conflicts.find(c => c.id === rid);
                    if (!related) return null;
                    return (
                      <button
                        key={rid}
                        onClick={() => setSelectedNode(rid)}
                        className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-slate-600/50 transition-colors"
                      >
                        {related.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1">
              {selectedConflict.parties.map((p, i) => {
                const country = countries[p.countryId];
                if (!country) return null;
                return (
                  <button
                    key={i}
                    onClick={() => onSelectCountry(p.countryId)}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] hover:bg-slate-600/50 transition-colors"
                  >
                    <span>{country.flagEmoji}</span>
                    <span className="text-slate-300">{country.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ConflictGraph;
