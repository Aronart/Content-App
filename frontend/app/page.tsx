'use client';

import { useEffect, useState } from 'react';
import { ContentQueueItemResponse, ContentStatus } from '@/types/generated';
import { getQueueItems } from '../services/queueService';
import QueueItemModal from '../components/QueueItemModal';
import { ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [queueItems, setQueueItems] = useState<ContentQueueItemResponse[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentQueueItemResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQueueItems();
  }, []);

  async function fetchQueueItems() {
    try {
      setLoading(true);
      setError(null);
      const items = await getQueueItems();
      setQueueItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch queue items');
    } finally {
      setLoading(false);
    }
  }

  function handleItemClick(item: ContentQueueItemResponse) {
    setSelectedItem(item);
    setIsModalOpen(true);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Content Queue</h1>
            <p className="text-sm text-gray-500">A list of all content items in the processing queue</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClockIcon className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading queue items</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : queueItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items in queue</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a content flow and adding items to your queue.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Content Flow
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Platform
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Created At
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Updated At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {queueItems.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {item.preview_path ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={item.preview_path}
                                    alt=""
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">ID: {item.id}</div>
                                <div className="text-gray-500">{item.source_platform}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${item.status === ContentStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                                item.status === ContentStatus.EDITING_ERROR || item.status === ContentStatus.POSTING_ERROR ? 'bg-red-100 text-red-800' :
                                item.status === ContentStatus.EDITING || item.status === ContentStatus.POSTING ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(item.updated_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <QueueItemModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </main>
  );
}
