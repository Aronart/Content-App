import { ContentQueueItemResponse } from '@/types/generated';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface QueueItemModalProps {
  item: ContentQueueItemResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QueueItemModal({ item, isOpen, onClose }: QueueItemModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-medium leading-6 text-gray-900">
              Queue Item Details
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Status</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  item.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                  item.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                {item.status}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Platform</h4>
              <p className="text-sm text-gray-600">{item.source_platform}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Created At</h4>
              <p className="text-sm text-gray-600">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Updated At</h4>
              <p className="text-sm text-gray-600">
                {new Date(item.updated_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
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

          {item.preview_path && (
            <div>
              <h4 className="font-medium text-gray-700">Preview</h4>
              <img
                src={item.preview_path}
                alt="Content preview"
                className="mt-2 rounded-lg max-h-48 object-cover"
              />
            </div>
          )}

          {item.error_log && (
            <div>
              <h4 className="font-medium text-gray-700">Error Log</h4>
              <pre className="mt-2 p-2 bg-red-50 rounded text-sm text-red-800 overflow-auto">
                {JSON.stringify(item.error_log, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <h4 className="font-medium text-gray-700">Source Data</h4>
            <pre className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600 overflow-auto">
              {JSON.stringify(item.source_data, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
