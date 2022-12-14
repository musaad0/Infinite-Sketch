import { Dialog } from '@headlessui/react';
import { EContextMenuActions } from 'enums/menuActions';
import Button from './Button';
import Modal from './Modal';

interface Props {
  isOpen: boolean;
  onClose: () => any;
  handleConfirm: () => any;
}
export default function TransparentToMouseModal({
  isOpen,
  onClose,
  handleConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title className="mb-2 text-center text-secondary">
        Confirmation
      </Dialog.Title>
      <Dialog.Description className="text-neutral-300">
        Are you sure you want InfiniteSketch to ignore mouse events? The only
        way to reset this option will be through the keyboard shortcut ( Ctrl Or
        Cmd + Shift + T) or by restarting the app
      </Dialog.Description>
      <div className="mt-4 flex justify-center gap-4 fill-secondary py-2 text-center text-secondary">
        <Button className="block w-full py-2 px-6" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button className="w-full py-2 px-6" variant="muted" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
