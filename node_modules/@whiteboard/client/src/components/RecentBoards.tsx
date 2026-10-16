import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { BoardSummary } from '@whiteboard/shared';

interface RecentBoardsProps {
  boards: BoardSummary[];
  onRemove: (id: string) => void;
}

export const RecentBoards: React.FC<RecentBoardsProps> = ({
  boards,
  onRemove,
}) => {
  if (boards.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>No recent whiteboards found on this browser.</p>
        <p className="text-xs mt-1">Create a new board to get started!</p>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {boards.map((b) => (
        <div
          key={b.id}
          className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/board/${b.id}`}
              className="font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate text-sm"
              title={b.title}
            >
              {b.title || 'Untitled Board'}
            </Link>
            <button
              onClick={() => onRemove(b.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Remove from history"
              aria-label="Remove board from history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{b.elementCount ?? 0} shapes</span>
            <div className="flex items-center gap-1">
              <span>{formatDate(b.updatedAt)}</span>
              <Link
                to={`/board/${b.id}`}
                className="text-indigo-600 dark:text-indigo-400"
              >
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
