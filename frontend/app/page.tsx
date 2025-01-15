'use client';

import { useEffect, useState } from 'react';
import { ContentQueueItem, ContentStatus } from '../types/queue';
import { getQueueItems } from '../services/queueService';
import QueueItemModal from '../components/QueueItemModal';
import { ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [queueItems, setQueueItems] = useState<ContentQueueItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentQueueItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQueueItems();
    // Refresh every 30 seconds
    const interval = setInterval(fetchQueueItems, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchQueueItems() {
    try {
      const items = await getQueueItems();
      setQueueItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to fetch queue items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleItemClick(item: ContentQueueItem) {
    setSelectedItem(item);
    setIsModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 flex items-center gap-2">
          <ExclamationCircleIcon className="h-6 w-6" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Content Queue</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClockIcon className="h-5 w-5" />
            Auto-refreshing every 30s
          </div>
        </div>

        {queueItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No items in the queue</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {queueItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                {item.preview_path ? (
                  <div className="aspect-video relative">
                    <img
                      src={item.preview_path}
                      alt="Content preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No preview</span>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {item.source_platform}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.status === ContentStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                        item.status === ContentStatus.FAILED ? 'bg-red-100 text-red-800' :
                        item.status === ContentStatus.PROCESSING ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="truncate">{item.source_url}</p>
                    <p className="mt-1">
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QueueItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
