
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Copy, Move, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ContentTransferProps {
  contentType: 'lectures' | 'notes' | 'dpps' | 'live';
  selectedItems: string[];
  batches: any[];
  onTransfer: (itemIds: string[], targetBatchId: string, operation: 'copy' | 'move') => void;
  onClose: () => void;
}

export function ContentTransfer({ 
  contentType, 
  selectedItems, 
  batches, 
  onTransfer, 
  onClose 
}: ContentTransferProps) {
  const [targetBatch, setTargetBatch] = useState('');
  const [operation, setOperation] = useState<'copy' | 'move'>('copy');
  const [isOpen, setIsOpen] = useState(false);

  const handleTransfer = () => {
    if (!targetBatch) {
      toast.error('Please select a target batch');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('No items selected');
      return;
    }

    onTransfer(selectedItems, targetBatch, operation);
    setIsOpen(false);
    setTargetBatch('');
    onClose();
    
    toast.success(
      `${selectedItems.length} ${contentType} ${operation === 'copy' ? 'copied to' : 'moved to'} ${
        batches.find(b => b.id === targetBatch)?.name || 'target batch'
      }`
    );
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Move className="w-4 h-4" />
          <span>Transfer Selected ({selectedItems.length})</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Selected Items: {selectedItems.length}</Label>
            <p className="text-sm text-muted-foreground">
              {selectedItems.length} {contentType} will be transferred
            </p>
          </div>

          <div>
            <Label htmlFor="operation">Operation</Label>
            <RadioGroup value={operation} onValueChange={(value: 'copy' | 'move') => setOperation(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copy" id="copy" />
                <Label htmlFor="copy" className="flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy (Keep original)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="move" id="move" />
                <Label htmlFor="move" className="flex items-center space-x-2">
                  <Move className="w-4 h-4" />
                  <span>Move (Remove from current batch)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="target-batch">Target Batch</Label>
            <Select value={targetBatch} onValueChange={setTargetBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransfer} className="flex items-center space-x-2">
              <span>{operation === 'copy' ? 'Copy' : 'Move'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
