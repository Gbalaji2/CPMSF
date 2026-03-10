import Modal from "../common/Modal";

export default function AdminFormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Save",
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        {children}

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          {submitText}
        </button>
      </form>
    </Modal>
  );
}