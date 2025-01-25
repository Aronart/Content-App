import { ContentQueueItemResponse, ContentStatus } from '@/types/generated';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface QueueItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentQueueItemResponse | null;
}

export default function QueueItemModal({ item, isOpen, onClose }: QueueItemModalProps) {
  if (!item) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Queue Item Details
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700">Status</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.status === ContentStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                          item.status === ContentStatus.EDITING_ERROR || item.status === ContentStatus.POSTING_ERROR ? 'bg-red-100 text-red-800' :
                          item.status === ContentStatus.EDITING || item.status === ContentStatus.POSTING ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Source Platform</h4>
                      <p className="text-sm text-gray-600">{item.source_platform}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Created At</h4>
                      <p className="text-sm text-gray-600">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Updated At</h4>
                      <p className="text-sm text-gray-600">{new Date(item.updated_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {item.error_log && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Error Log</h4>
                      <pre className="mt-1 text-sm text-red-600 whitespace-pre-wrap bg-red-50 rounded-md p-4">
                        {JSON.stringify(item.error_log, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">Source Data</h4>
                    <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-md p-4">
                      {JSON.stringify(item.source_data, null, 2)}
                    </pre>
                  </div>

                  {item.source_url && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Source URL</h4>
                      <a 
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {item.source_url}
                      </a>
                    </div>
                  )}

                  {item.preview_path && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Preview</h4>
                      <img
                        src={item.preview_path}
                        alt="Content preview"
                        className="mt-2 rounded-lg max-h-48 object-cover"
                      />
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
